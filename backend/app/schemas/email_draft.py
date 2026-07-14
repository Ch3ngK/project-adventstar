from datetime import datetime

from pydantic import BaseModel, ConfigDict

class EmailDraft(BaseModel):
    subject: str
    body: str
    open_questions: list[str]

class EmailDraftResponse(EmailDraft):
    model_config = ConfigDict(from_attributes=True)
    id: int
    kind: str
    enquiry_id: int | None = None
    lead_id: int | None = None
    created_at: datetime

