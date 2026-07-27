from pydantic import BaseModel


class WhatsAppAgentResult(BaseModel):
    needs_escalation: bool
    reasoning: str
    reply_body: str