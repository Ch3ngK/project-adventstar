from datetime import datetime 

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.db.base import Base

class Lead(Base): 
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True, index=True)
    notes = Column(Text, nullable=False)
    status = Column(String, default="new", nullable=False)
    source = Column(String, nullable=False, default="manual") # "manual" or "whatsapp"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)