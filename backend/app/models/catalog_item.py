from datetime import datetime 

from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text

from app.db.base import Base 

class CatalogItem(Base):
    __tablename__ = "catalog_items" 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    unit_price = Column(Numeric(10, 2), nullable=False)
    stock_quantity = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    