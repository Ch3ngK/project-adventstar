import json

from openai import OpenAI, OpenAIError
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import CatalogItem, ChatMessage, Customer, Lead, Quote, Order

client = OpenAI(api_key=settings.openai_api_key)

class BusinessAssistantError(Exception):
    """Raised when the business assistant fails to produce a usable reply."""


class AssistantReply(BaseModel):
    answer: str

MAX_TOOL_ITERATIONS = 5
_RESULT_ROW_LIMIT = 50

SYSTEM_PROMPT = """
    You are an internal analytics assistant for Advent Star, a Singapore uniform supplier,
    talking directly to the business owner (not a customer).
    - Never state a price, stock level, customer detail, quote, or order fact
      from memory - always call the relevant lookup tool first, answer only from
      what it returns.
    - If a tool returns no matching rows, say so; do not guess.
    - Prefer the narrowest tool call that answers the question.
    - Keep answers concise — this is an internal working tool.
"""
## Tool calling for handing the model a set of functions it can request,
## without hardcoding which one runs for which question.

TOOLS = [
    {
        "type": "function",
        "name": "list_catalog_items",
        "strict": True,
        "description": "Products/services with unit price and stock quantity.",
        "parameters": {
            "type": "object",
            "properties": {"search": {"type": ["string", "null"]}},
            "required": ["search"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "list_customers",
        "strict": True,
        "description": "Customers, with company name, email, and phone.",
        "parameters": {
            "type": "object",
            "properties": {"search": {"type": ["string", "null"]}},
            "required": ["search"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "list_leads",
        "strict": True,
        "description": "Prospective leads not yet converted to customers, optionally filtered by status (new, contacted, converted, dead).",
        "parameters": {
            "type": "object",
            "properties": {"status": {"type": ["string", "null"]}},
            "required": ["status"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "list_quotes",
        "strict": True,
        "description": "Quotes sent to customers, optionally filtered by status (draft, sent, approved, rejected) and/or customer id.",
        "parameters": {
            "type": "object",
            "properties": {
                "status": {"type": ["string", "null"]},
                "customer_id": {"type": ["integer", "null"]},
            },
            "required": ["status", "customer_id"],
            "additionalProperties": False,
        },
    },
    {
        "type": "function",
        "name": "list_orders",
        "strict": True,
        "description": "Orders placed by customers, optionally filtered by status (pending, etc).",
        "parameters": {
            "type": "object",
            "properties": {"status": {"type": ["string", "null"]}},
            "required": ["status"],
            "additionalProperties": False,
        },
    }
]

def _list_catalog_items(db: Session, args: dict) -> list[dict]:
    query = db.query(CatalogItem)
    search = args.get("search")

    if search:
        query = query.filter(CatalogItem.name.ilike(f"%{search}%"))

    items = query.order_by(CatalogItem.name.asc()).limit(_RESULT_ROW_LIMIT).all()

    return [
        {
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "unit_price": str(item.unit_price),
            "stock_quantity": item.stock_quantity,
        }
        for item in items
    ]

def _list_customers(
        db: Session,
        args: dict
) -> list[dict]:
    query = db.query(Customer)
    search = args.get("search")
    ## Search is a string, it can be "Acme" or "None"
    ## If Search is not None, meaning there is a filter applied,....
    if search:
        query = query.filter(Customer.name.ilike(f"%{search}%")) # ilike: isensitive like

    customers = query.order_by(Customer.created_at.desc()).limit(_RESULT_ROW_LIMIT).all()

    return [
        {
            "id": customer.id,
            "name": customer.name,
            "company_name": customer.company_name,
            "email": customer.email,
            "phone": customer.phone,
        }
        for customer in customers
    ]

def _list_leads(db: Session, args: dict) -> list[dict]:
    query = db.query(Lead)
    status = args.get("status")

    if status:
        query = query.filter(Lead.status == status)

    leads = query.order_by(Lead.created_at.desc()).limit(_RESULT_ROW_LIMIT).all()

    return [
        {
            "id": lead.id,
            "contact_name": lead.contact_name,
            "company_name": lead.company_name,
            "email": lead.email,
            "phone": lead.phone,
            "status": lead.status,
        }
        for lead in leads
    ]

def _list_quotes(db: Session, args: dict) -> list[dict]:
    query = db.query(Quote)
    status = args.get("status")
    customer_id = args.get("customer_id")

    if status:
        query = query.filter(Quote.status == status)

    if customer_id:
        query = query.filter(Quote.customer_id == customer_id)

    quotes = query.order_by(Quote.created_at.desc()).limit(_RESULT_ROW_LIMIT).all()

    return [
        {
            "id": quote.id,
            "customer_id": quote.customer_id,
            "status": quote.status,
            "total_amount": str(quote.total_amount),
        }
        for quote in quotes
    ]

def _list_orders(db: Session, args: dict) -> list[dict]:
    query = db.query(Order)
    status = args.get("status")

    if status:
        query = query.filter(Order.status == status)

    orders = query.order_by(Order.created_at.desc()).limit(_RESULT_ROW_LIMIT).all()

    return [
        {
            "id": order.id,
            "customer_id": order.customer_id,
            "quote_id": order.quote_id,
            "status": order.status,
        }
        for order in orders
    ]

TOOL_IMPLEMENTATIONS = {
    "list_catalog_items": _list_catalog_items,
    "list_customers": _list_customers,
    "list_leads": _list_leads,
    "list_quotes": _list_quotes,
    "list_orders": _list_orders,
}

def ask_business_assistant(db: Session, history: list[ChatMessage], question: str) -> str:
    input_items = [{"role": m.role, "content": m.body} for m in history]
    input_items.append({"role": "user", "content": question})

    try:
        for _ in range(MAX_TOOL_ITERATIONS):
            response = client.responses.parse(
                model="gpt-5.5",
                instructions=SYSTEM_PROMPT,
                input=input_items,
                tools=TOOLS,
                text_format=AssistantReply,
            )
            ## response.output produces a mix of types, not just one kind. The model(OpenAI) API call can include 0/1/ or several
            ## function_call items
            ## function call is a built-in pydantic model
            ## function call example:
            ## For a function_call item:
            ##          type="function_call"
            ##          call_id="call_abc123"   # unique ID for this specific call, used to match the result back to it
            ##          name="list_catalog_items"
            ##          arguments='{"search": "Polo T-shirt"}'
            ##          id="fc_1"
            ## response.output can also include a "message" type.
            function_calls = [item for item in response.output if item.type == "function_call"]

            if not function_calls:
                if response.output_parsed is None:
                    raise BusinessAssistantError("Assistant response could not be parsed.")

                return response.output_parsed.answer

            input_items += response.output

            for call in function_calls:
                implementation = TOOL_IMPLEMENTATIONS.get(call.name)
                args = json.loads(call.arguments)
                result = implementation(db, args) if implementation else {"error": f"Unknown tool {call.name}"}
                input_items.append({
                    "type": "function_call_output",
                    "call_id": call.call_id,
                    "output": json.dumps(result, default=str),
                })
    except OpenAIError as exc:
        raise BusinessAssistantError("Failed to generate assistant reply." ) from exc

    raise BusinessAssistantError("Assistant did not produce a final answer within the tool-call limit.")
