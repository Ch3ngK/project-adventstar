from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text 
from sqlalchemy.orm import declarative_base

Base = declarative_base() #To show that any class inheriting from Base can be treated as a database-mapped model

class Enquiry(Base): 
    __tablename__ = "enquiries" 

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    company_name = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String, default="new", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)