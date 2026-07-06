from datetime import datetime

from pydantic import BaseModel, ConfigDict

class QuoteDraftItem(BaseModel): 
    description: str
    quantity: int | None = None

class QuoteDraft(BaseModel):
    items: list[QuoteDraftItem]
    suggested_notes: str
    open_questions: list[str]

class QuoteDraftResponse(QuoteDraft):
    model_config = ConfigDict(from_attributes=True)

    id: int 
    enquiry_id: int 
    created_at: datetime