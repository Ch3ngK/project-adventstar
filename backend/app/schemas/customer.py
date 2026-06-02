from datetime import datetime

from pydantic import BaseModel, ConfigDict

class CustomerCreate(BaseModel):
    name: str
    company_name: str
    email: str
    phone: str | None = None

class CustomerResponse(BaseModel): 
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    company_name: str
    email: str
    phone: str | None = None
    created_at: datetime