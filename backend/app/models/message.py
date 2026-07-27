from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.db.base import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False, index=True)
    direction = Column(String, nullable=False) # Holds "inbound" or "outbound"
    sender_type = Column(String, nullable=False) # Holds "customer", "ai", or "staff" - who's talking
    status = Column(String, nullable=False) # Holds "received", "sent", "draft_pending_review" or "failed"
    body = Column(Text, nullable=False)
    ai_reasoning = Column(Text, nullable=True)
    twilio_message_sid = Column(String, nullable=True)
    sent_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)