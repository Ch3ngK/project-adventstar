from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter
from app.core.security import get_current_user
from app.db.session import get_db
from app.models import ChatMessage, ChatSession, User
from app.schemas import ChatMessageResponse, ChatMessageSendRequest, ChatSendResponse, ChatSessionResponse
from app.services.business_assistant import BusinessAssistantError, ask_business_assistant

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/sessions", response_model=ChatSessionResponse)
def create_chat_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ChatSession:
    new_session = ChatSession(user_id=current_user.id)

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session

@router.get("/sessions", response_model=list[ChatSessionResponse])
def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatSession]:
    return (db.query(ChatSession)
            .filter(ChatSession.user_id == current_user.id)
            .order_by(ChatSession.last_message_at.desc())
            .all()
    )

@router.get("/sessions/{session_id}/messages", response_model=list[ChatMessageResponse])
def get_chat_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ChatMessage]:
    chat_session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )

    if chat_session is None:
        raise HTTPException(status_code=404, detail="Chat session not found.")

    return (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

@router.post("/sessions/{session_id}/messages", response_model=ChatSendResponse)
@limiter.limit("20/minute")
def send_chat_message(
    session_id: int,
    message_request: ChatMessageSendRequest, 
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ChatSendResponse: 
    chat_session = (
        db.query(ChatSession)
        .filter(ChatSession.id == session_id, ChatSession.user_id == current_user.id)
        .first()
    )

    if chat_session is None: 
        raise HTTPException(status_code=404, detail="Chat session not found.")

    history = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at.desc())
        .all()
    )

    user_message = ChatMessage(
        session_id=session_id, 
        role="user",
        body=message_request.body,
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    try: 
        answer = ask_business_assistant(db, history, message_request.body)
    except BusinessAssistantError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    assistant_message = ChatMessage(
        session_id=session_id, 
        role="assistant",
        body=answer, 
    )
    db.add(assistant_message)

    if chat_session.title == "New chat":
        chat_session.title = message_request.body[:60]

    chat_session.last_message_at = datetime.utcnow()

    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)

    return ChatSendResponse(user_message=user_message, assistant_message=assistant_message)


