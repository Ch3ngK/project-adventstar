from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, Text

from app.db.base import Base

class Quote(Base):
    __tablename__ = "quotes"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False) # ForeignKey: Used to connect one table to another (in this case, this column must point to a valid row in customers table)
    enquiry_id = Column(Integer, ForeignKey("enquiries.id"), nullable=False)
    status = Column(String, default="draft", nullable=False)
    total_amount = Column(Numeric(10,2), nullable=False)
    notes = Column(Text, nullable=True) # Can be string too, but Text is better for longer free-form text
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
