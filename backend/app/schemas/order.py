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
    status: int
    notes: str | None = None
    created_at: datetime

class OrderStatusUpdate(BaseModel):
    status: str