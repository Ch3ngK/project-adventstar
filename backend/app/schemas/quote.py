from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

class QuoteCreate(BaseModel):
    customer_id: int
    enquiry_id: int
    total_amount: Decimal
    notes: str | None = None


class QuoteStatusUpdate(BaseModel):
    status: str


class QuoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True) # For extracting the attributes from the Python Object

    id: int
    customer_id: int
    enquiry_id: int
    status: str
    total_amount: Decimal
    notes: str | None = None
    created_at: datetime
