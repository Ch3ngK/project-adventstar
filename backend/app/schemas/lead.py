from datetime import datetime

from pydantic import BaseModel, ConfigDict


class LeadCreate(BaseModel):
    contact_name: str
    company_name: str
    email: str
    phone: str | None = None
    notes: str

class LeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contact_name: str
    company_name: str
    email: str
    phone: str | None = None
    notes: str
    created_at: datetime