from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EnquiryCreate(BaseModel):
    customer_name: str
    customer_id: int | None = None
    company_name: str | None = None
    email: str
    phone: str | None = None
    message: str
    


class EnquiryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_id: int | None = None
    company_name: str | None = None
    email: str
    phone: str | None = None
    message: str
    status: str
    created_at: datetime


class EnquiryStatusUpdate(BaseModel):
    status: str
