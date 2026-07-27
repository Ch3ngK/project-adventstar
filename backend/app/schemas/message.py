from datetime import datetime 

from pydantic import BaseModel, ConfigDict

class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    direction: str
    sender_type: str
    status: str
    body: str
    ai_reasoning: str | None = None
    twilio_message_sid: str | None = None
    sent_by_user_id: int | None = None
    created_at: datetime

class MessageSendRequest(BaseModel):
    body: str 