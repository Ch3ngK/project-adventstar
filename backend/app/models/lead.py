from datetime import datetime 

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.db.base import Base

class Lead(Base): 
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    notes = Column(Text, nullable=False)
    status = Column(String, default="new", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)