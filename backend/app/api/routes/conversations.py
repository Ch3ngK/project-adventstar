from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter
from app.core.security import get_current_user
from app.db.session import get_db
from app.models import Conversation, Lead, Message, User
from app.schemas import ConversationSummary, MessageResponse, MessageSendRequest
from app.services.twilio_client import WhatsAppSendError, send_whatsapp_message

router = APIRouter(tags=["conversations"])

@router.get("/conversations", response_model=list[ConversationSummary])
def get_conversations(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> list[ConversationSummary]:
    conversations = (
        db.query(Conversation)
        .order_by(Conversation.last_message_at.desc())
        .all()
    )

    summaries = []
    for conversation in conversations:
        lead = db.query(Lead).filter(Lead.id == conversation.lead_id).first()
        last_message = (
            db.query(Message)
            .filter(Message.conversation_id == conversation.id)
            .order_by(Message.created_at.desc())
            .first()
        )
        needs_review = (
            db.query(Message)
            .filter(
                Message.conversation_id == conversation.id, 
                Message.status == "draft_pending_review",
            )
            .first()
            is not None 
        )

        summaries.append(ConversationSummary(
            id=conversation.id,
            lead_id=conversation.lead_id,
            phone_number=conversation.phone_number,
            contact_name=lead.contact_name,
            company_name=lead.company_name,
            last_message_at=conversation.last_message_at,
            last_message_preview=last_message.body if last_message else "",
            needs_review=needs_review,
            created_at=conversation.created_at,
        ))

    return summaries

@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Message]:
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

@router.post("/conversations/{conversation_id}/messages", 
response_model=MessageResponse)
@limiter.limit("5/minute")
def send_conversation_message(
    conversation_id: int,
    message_request: MessageSendRequest, 
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Message: 
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    try:
        sid = send_whatsapp_message(conversation.phone_number, message_request.body)
        status_value = "sent" 
    except WhatsAppSendError: 
        sid = None 
        status_value = "failed"

    message = Message(
        conversation_id=conversation.id,
        direction="outbound",
        sender_type="staff",
        status=status_value,
        body=message_request.body,
        twilio_message_sid=sid,
        sent_by_user_id=current_user.id,
    )
    db.add(message)

    conversation.last_message_at = datetime.utcnow()

    db.commit()
    db.refresh(message)

    return message

@router.patch("/messages/{message_id}", response_model=MessageResponse)
@limiter.limit("5/minute")
def approve_draft_message(
    message_id: int,
    message_request: MessageSendRequest,
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Message:
    message = (
        db.query(Message)
        .filter(Message.id == message_id,
                Message.status == "draft_pending_review")
        .first()
    )

    if message is None: 
        raise HTTPException(status_code=404, detail="Draft message not found") 

    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == message.conversation_id)
        .first()
    )

    message.body = message_request.body

    try:
        message.twilio_message_sid = send_whatsapp_message(conversation.phone_number, message.body)
        message.status = "sent"
    except WhatsAppSendError:
        message.status = "failed" 

    message.sent_by_user_id = current_user.id
    conversation.last_message_at = datetime.utcnow()

    db.commit()
    db.refresh(message)

    return message 
