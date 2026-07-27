from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.db.base import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False, default="New chat")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, default=datetime.utcnow, nullable=False)

