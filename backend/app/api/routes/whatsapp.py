from datetime import datetime 

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session 

from app.db.session import get_db
from app.models import Conversation, Lead, Message
from app.services.twilio_client import is_valid_twilio_request, WhatsAppSendError, send_whatsapp_message
from app.services.whatsapp_agent import classify_and_reply, WhatsAppAgentError

router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

EMPTY_TWIML = "<Response></Response>"

@router.post("/webhook")
async def whatsapp_webhook(
    request: Request, 
    db: Session = Depends(get_db)
) -> Response:
    form = await request.form()
    signature = request.headers.get("X-Twilio-Signature", "")

    if not is_valid_twilio_request(str(request.url), dict(form), signature):
        return Response(status_code=403)

    from_number = str(form.get("From", "")).removeprefix("whatsapp:")
    body = str(form.get("Body", ""))
    profile_name = form.get("ProfileName")

    lead = db.query(Lead).filter(Lead.phone == from_number).first()

    if lead is None: 
        lead = Lead(
            contact_name=profile_name or f"WhatsApp {from_number}",
            notes="",
            phone=from_number,
            source="whatsapp",
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)

    conversation = db.query(Conversation).filter(Conversation.lead_id == lead.id).first()

    if conversation is None: 
        conversation = Conversation(lead_id=lead.id, phone_number=from_number)
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    conversation.last_message_at = datetime.utcnow()

    message = Message(
        conversation_id=conversation.id, 
        direction="inbound",
        sender_type="customer",
        status="received",
        body=body,
    )
    db.add(message)
    db.commit()

    recent_messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.desc())
        .limit(10)
        .all()
    )
    recent_messages.reverse()

    try: 
        result = classify_and_reply(lead, recent_messages)
    except WhatsAppAgentError:
        print(f"WhatsApp classify_and_reply failed for lead {lead.id}")
        return Response(content=EMPTY_TWIML, media_type="application/xml")

    if result.needs_escalation:
        db.add(Message(
            conversation_id=conversation.id,
            direction="outbound",
            sender_type="ai",
            status="draft_pending_review",
            body=result.reply_body,
            ai_reasoning=result.reasoning,
        ))
    else:
        try:
            sid = send_whatsapp_message(from_number, result.reply_body)
            db.add(Message(
                conversation_id=conversation.id,
                direction="outbound",
                sender_type="ai",
                status="sent",
                body=result.reply_body,
                ai_reasoning=result.reasoning,
                twilio_message_sid=sid,
            ))
        except WhatsAppSendError:
            db.add(Message(
                conversation_id=conversation.id,
                direction="outbound",
                sender_type="ai",
                status="failed",
                body=result.reply_body,
                ai_reasoning=result.reasoning,
            ))

    db.commit()

    return Response(content=EMPTY_TWIML, media_type="application/xml")