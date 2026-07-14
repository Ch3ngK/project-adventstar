from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text

from app.db.base import Base

class EmailDraftRecord(Base):
    __tablename__ = "email_drafts"

    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String, nullable=False) # Reply or outreach
    enquiry_id = Column(Integer, ForeignKey("enquiries.id"), nullable=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True, index=True)
    subject = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    open_questions = Column(JSON, nullable=False)
    created_at = Column(DateTime, 
                        default=datetime.utcnow, nullable=False)