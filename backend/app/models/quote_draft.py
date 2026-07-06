from datetime import datetime 

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text

from app.db.base import Base

class QuoteDraftRecord(Base):
    __tablename__ = "quote_drafts"

    id = Column(Integer, primary_key=True, index=True)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id"), nullable=False, index=True)
    items = Column(JSON, nullable=False)
    suggested_notes = Column(Text, nullable=False)
    open_questions = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)