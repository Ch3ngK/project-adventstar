from openai import OpenAI, OpenAIError

from app.core.config import settings
from app.models import Lead, Message
from app.schemas.whatsapp_agent import WhatsAppAgentResult

client = OpenAI(api_key=settings.openai_api_key)

class WhatsAppAgentError(Exception): 
    """Raised when the WhatsApp assistant fails to produce a usable reply."""

def classify_and_reply(lead: Lead, recent_messages: list[Message]) -> WhatsAppAgentResult:
    thread = "\n".join(
        f"{'Customer' if m.direction == 'inbound' else 'Advent Star'}: {m.body}"
        for m in recent_messages
    )

    try:
        response = client.responses.parse(
            model="gpt-5.5",
            instructions="""
                You are an internal AI assistant for Advent Star, a Singapore uniform supplier,
                replying to customers over WhatsApp on the company's behalf.

                You may auto-reply directly to: greetings, questions about business hours,
                location, general company/product descriptions, high-level questions about
                Advent Star's capabilities, and generic questions about how ordering works.

                You must escalate to staff (set needs_escalation=True) instead of sending
                anything about: price, cost, quotes, discounts, minimum order quantities,
                delivery-date commitments, order changes, payment, negotiation, complaints,
                or anything else that needs customer-specific data you have not been given.

                Never invent prices, timelines, or commitments that haven't been confirmed
                internally.

                Always populate reply_body with a real draft reply, even when escalating —
                staff will review and edit it rather than starting from a blank message.

                Keep replies short and WhatsApp-appropriate in tone. Do not use an email-style
                signoff.
            """,
            input=(
                f"Contact: {lead.contact_name}\n"
                f"Company: {lead.company_name or 'N/A'}\n"
                f"Recent conversation:\n{thread}"
            ), 
            text_format=WhatsAppAgentResult,
        )
    except OpenAIError as exc:
        raise WhatsAppAgentError("Failed to generate WhatsApp reply.") from exc

    if response.output_parsed is None: 
        raise WhatsAppAgentError("WhatsApp reply response could not be parsed.")

    return response.output_parsed