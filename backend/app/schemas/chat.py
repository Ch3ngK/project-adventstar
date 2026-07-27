from datetime import datetime

from pydantic import BaseModel, ConfigDict

class ChatSessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    created_at: datetime
    last_message_at: datetime


class ChatMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    session_id: int
    role: str
    body: str
    created_at: datetime


class ChatMessageSendRequest(BaseModel):
    body: str


class ChatSendResponse(BaseModel):
    user_message: ChatMessageResponse
    assistant_message: ChatMessageResponse