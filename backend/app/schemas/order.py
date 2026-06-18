from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

class OrderCreate(BaseModel): 
    customer_id: int
    quote_id: int
    notes: str | None = None

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    quote_id: int
    status: str
    notes: str | None = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OrderStatusUpdate(BaseModel):
    status: str