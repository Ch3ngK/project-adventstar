from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter 
from app.core.security import get_current_user
from app.db.session import get_db
from app.models import Customer, Enquiry, User, QuoteDraftRecord, EmailDraftRecord
from app.schemas import (
    EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate, 
    QuoteDraftResponse, QuoteDraft, 
    EmailDraftResponse, EmailDraft)
from app.services.quote_agent import QuoteDraftGenerationError, draft_quote
from app.services.email_agent import EmailDraftGenerationError, draft_enquiry_reply

router = APIRouter(prefix="/enquiries", tags=["enquiries"])


@router.post("", response_model=EnquiryResponse)
def create_enquiry(
    enquiry: EnquiryCreate, db: Session = Depends(get_db)
) -> Enquiry:
    resolved_customer_id = enquiry.customer_id

    if resolved_customer_id is not None:
        customer = (
            db.query(Customer)
            .filter(Customer.id == resolved_customer_id)
            .first()
        )

        if customer is None: 
            raise HTTPException(status_code=404, detail="Customer not found.") # Check if there is an existing customer ID for the same customer
    else:
        customer = (    # Else check if the customer's email is already registered.
            db.query(Customer)
            .filter(Customer.email == enquiry.email)
            .first()
        )

        if customer is None: 
            if not enquiry.company_name:
                raise HTTPException(
                    status_code=400,
                    detail="Company / School is required when creating a new customer.",
                )
            
            customer = Customer(
                name=enquiry.customer_name,
                company_name=enquiry.company_name,
                email=enquiry.email,
                phone=enquiry.phone,
            )

            db.add(customer)
            db.commit()
            db.refresh(customer)

        resolved_customer_id = customer.id

    new_enquiry = Enquiry(
        customer_name=enquiry.customer_name,
        company_name=enquiry.company_name,
        email=enquiry.email,
        phone=enquiry.phone,
        message=enquiry.message,
        customer_id=resolved_customer_id,
    )

    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    return new_enquiry


@router.get("", response_model=list[EnquiryResponse])
def get_enquiries(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Enquiry]:
    return db.query(Enquiry).all()

@router.post("/{enquiry_id}/draft-quote", response_model=QuoteDraftResponse)
@limiter.limit("5/minute")
def create_quote_draft(
    enquiry_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> QuoteDraft:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None: 
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    try:
        draft = draft_quote(enquiry)
    except QuoteDraftGenerationError: 
        raise HTTPException(
            status_code=502, 
            detail="Unable to generate quote draft. Please try again.",
        )

    draft_record = QuoteDraftRecord(
        enquiry_id=enquiry_id, 
        items=[item.model_dump() for item in draft.items], # Converts draft.items Pydantic schema objects to normal data(dict)
        suggested_notes=draft.suggested_notes,
        open_questions=draft.open_questions, 
    )

    db.add(draft_record)
    db.commit()
    db.refresh(draft_record)

    return draft_record

@router.get("/{enquiry_id}/draft-quote", response_model=list[QuoteDraftResponse])
def get_quote_drafts(
    enquiry_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list[QuoteDraftRecord]:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None: 
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    
    return (
        db.query(QuoteDraftRecord)
        .filter(QuoteDraftRecord.enquiry_id == enquiry.id)
        .order_by(QuoteDraftRecord.created_at.desc())
        .all()
    )

@router.get("/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    return enquiry




@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: int,
    status_update: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    enquiry.status = status_update.status
    db.commit()
    db.refresh(enquiry)

    return enquiry


@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Response:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    db.delete(enquiry)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{enquiry_id}/draft-email", response_model=EmailDraftResponse)
@limiter.limit("5/minute")
def create_email_draft(
    enquiry_id: int,
    request: Request,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> EmailDraft:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    
    try:
        draft = draft_enquiry_reply(enquiry)
    except EmailDraftGenerationError:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate email draft. Please try again.",
        )
    
    draft_record = EmailDraftRecord(
        kind="reply",
        enquiry_id=enquiry_id,
        lead_id=None,
        subject=draft.subject,
        body=draft.body,
        open_questions=draft.open_questions,
    )

    db.add(draft_record)
    db.commit()
    db.refresh(draft_record)

    return draft_record

@router.get("/{enquiry_id}/draft-email", response_model=list[EmailDraftResponse])
@limiter.limit("5/minute")
def get_email_drafts(
    enquiry_id: int,
    request: Request,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> list[EmailDraftRecord]:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()
    
    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    return (
        db.query(EmailDraftRecord)
        .filter(EmailDraftRecord.enquiry_id == enquiry_id)
        .order_by(EmailDraftRecord.created_at.desc())
        .all()
    )