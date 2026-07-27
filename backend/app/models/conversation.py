from datetime import datetime 

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String 

from app.db.base import Base 

class Conversation(Base): 
    __tablename__ = "conversations" 

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False, index=True)
    phone_number = Column(String, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, default=datetime.utcnow, nullable=False)

