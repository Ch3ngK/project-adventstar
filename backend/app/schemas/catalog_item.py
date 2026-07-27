from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

class CatalogItemCreate(BaseModel):
    name: str 
    description: str | None = None
    unit_price: Decimal 
    stock_quantity: int | None = None 

class CatalogItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None 
    unit_price: Decimal | None = None 
    stock_quantity: int | None = None 

class CatalogItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int 
    name: str
    description: str | None = None 
    unit_price: Decimal
    stock_quantity: int | None = None
    created_at: datetime 
    updated_at: datetime 

