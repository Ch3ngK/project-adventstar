from openai import OpenAI, OpenAIError

from app.core.config import settings 
from app.models import Enquiry, Lead
from app.schemas.email_draft import EmailDraft 

client = OpenAI(api_key=settings.openai_api_key)

class EmailDraftGenerationError(Exception): 
    """Raised when the email drafting agent fails to produce a usable draft."""

def draft_enquiry_reply(enquiry: Enquiry) -> EmailDraft: 
    try: 
        response = client.responses.parse(
            model="gpt-5.5",
            instructions="""
                You are an internal assistant for Advent Star, a Singapore uniform supplier.
                You are drafting a reply email to a customer who has already messaged you.

                Rules: 
                - Warm, professional tone, written as Advent Star staff replying to this specific customer. 
                - Address what they actually asked - do not paraphrase generically. 
                - Never invent prices, timelines, or commitments that haven't been confirmed internally. 
                - If the enquiry is missing information needed to give a real answer, note it in open_questions instead of guessing. 
                - Sign off as the "The Advent Star Team". 
                
                """,
            input=(
                f"Customer: {enquiry.customer_name}\n"
                f"Company: {enquiry.company_name or 'N/A'}\n"
                f"Enquiry message:\n{enquiry.message}"
            ),
            text_format=EmailDraft,   
        )
    except OpenAIError as exc:
        raise EmailDraftGenerationError("Failed to generate email draft.") from exc
    
    if response.output_parsed is None: 
        raise EmailDraftGenerationError("Email draft response could not be parsed.")
    
    return response.output_parsed


def draft_outreach_email(lead: Lead) -> EmailDraft:
    try:
        response = client.responses.parse(
            model="gpt-5.5",
            instructions="""
                You are an internal assistant for Advent Star, a Singapore uniform supplier.
                You are drafting a cold outreach email introducing Advent Star to a prospect
                who has not contacted us before.

                Rules:
                - Professional, concise, low-pressure tone — this is an introduction, not a pitch email
                  full of superlatives.
                - Use the notes provided to make the email specific to this prospect; do not send a
                  generic template if there is real context to draw on.
                - Never invent prices, timelines, or claims about Advent Star that aren't given to you.
                - If there isn't enough context to personalize the email meaningfully, say so in
                  open_questions rather than guessing at a personalization.
                - Sign off as "The Advent Star Team".
            """,
            input=(
                f"Contact: {lead.contact_name}\n"
                f"Company: {lead.company_name}\n"
                f"Notes: {lead.notes}"
            ),
            text_format=EmailDraft,
        )
    except OpenAIError as exc:
        raise EmailDraftGenerationError("Failed to generate email draft.") from exc

    if response.output_parsed is None:
        raise EmailDraftGenerationError("Email draft response could not be parsed.")

    return response.output_parsed