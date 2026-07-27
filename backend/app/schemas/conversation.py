from datetime import datetime 

from pydantic import BaseModel

class ConversationSummary(BaseModel):   
    id: int
    lead_id: int 
    phone_number: str
    contact_name: str
    company_name: str | None = None
    last_message_at: datetime 
    last_message_preview: str 
    needs_review: bool
    created_at: datetime 