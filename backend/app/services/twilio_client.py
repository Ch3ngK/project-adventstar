from twilio.base.exceptions import TwilioRestException
from twilio.request_validator import RequestValidator
from twilio.rest import Client

from app.core.config import settings

class WhatsAppSendError(Exception):
    """Raised when sending a WhatsApp message via Twilio fails."""

def send_whatsapp_message(to_phone: str, body: str) -> str:
    if not (settings.twilio_account_sid and settings.twilio_auth_token and settings.twilio_whatsapp_number):
        raise WhatsAppSendError("Twilio is not configured.")

    client = Client(settings.twilio_account_sid, settings.twilio_auth_token)

    try:
        message = client.messages.create(
            from_=f"whatsapp:{settings.twilio_whatsapp_number}",
            to=f"whatsapp:{to_phone}",
            body=body,
        )
    except TwilioRestException as exc:
        raise WhatsAppSendError("Failed to send WhatsApp message.") from exc

    return message.sid

def is_valid_twilio_request(url: str, params: dict, signature: str) -> bool:
    if not settings.twilio_auth_token:
        return False 

    validator = RequestValidator(settings.twilio_auth_token)
    return validator.validate(url, params, signature)