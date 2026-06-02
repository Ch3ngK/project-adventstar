from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, ForeignKey, String, Text

from app.db.base import Base


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True) # Set nullable to false once enquiry creation flow is updated.
    customer_name = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, default="new", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
