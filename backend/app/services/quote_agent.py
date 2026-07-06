from openai import OpenAI 

from app.core.config import settings
from app.models import Enquiry
from app.schemas.quote_draft import QuoteDraft

client = OpenAI(api_key=settings.openai_api_key)

def draft_quote(enquiry: Enquiry) -> QuoteDraft:
    response = client.responses.parse(
        model="gpt-5.5",
        instructions="""
            You are an internal assistant for Advent Star, a Singapore uniform supplier.
            You are given a customer enquiry and must extract a structured quote draft.

            Rules:
            - Do not invent quantities, sizes, garment types, or specs that were not 
              mentioned or clearly implied by the enquiry. 
            - If something needed to price the job is missing or ambiguous (quantity, sizes,
              garment type, branding method, timeline), add a short question about it to open_questions 
              instead of guessing.
            - Never invent a price or total amount.
            - Keep suggested_notes factual and concise, summarizing what the customer is asking for so staff can turn it into a quote. 
        """,
        input=(
            f"Customer: {enquiry.customer_name}\n"
            f"Company: {enquiry.company_name or 'N/A'}\n"
            f"Enquiry message:\n{enquiry.message}"
        ),
        text_format=QuoteDraft,
    )
    return response.output_parsed