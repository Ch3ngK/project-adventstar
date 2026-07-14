from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.rate_limit import limiter
from app.core.security import get_current_user
from app.db.session import get_db
from app.models import Lead, User, EmailDraftRecord
from app.schemas import LeadCreate, LeadResponse, EmailDraftResponse, EmailDraft
from app.services.email_agent import EmailDraftGenerationError, draft_outreach_email

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("", response_model=LeadResponse)
def create_lead(
    lead: LeadCreate, 
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> Lead:
    new_lead = Lead(
        contact_name=lead.contact_name,
        company_name=lead.company_name,
        email=lead.email,
        phone=lead.phone,
        notes=lead.notes,
    )

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return new_lead

@router.get("", response_model=list[LeadResponse])
def get_leads(
    db: Session = Depends(get_db),
    _current_user = Depends(get_current_user),
) -> list[Lead]:
    return db.query(Lead).all()

@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user)
) -> Lead:
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if lead is None: 
        raise HTTPException(
            status_code=404,
            detail="Lead not found."
        )

    return lead

@router.post("/{lead_id}/draft-email", response_model=EmailDraftResponse)
@limiter.limit("5/minute")
def create_lead_email_draft(
    lead_id: int,
    request: Request,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> EmailDraftRecord:
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if lead is None:
        raise HTTPException(
            status_code=404,
            detail="Lead not found."
        )
    
    try:
        draft = draft_outreach_email(lead)
    except EmailDraftGenerationError:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate email draft. Please try again."
        )

    draft_record = EmailDraftRecord(
        kind="outreach",
        enquiry_id=None,
        lead_id=lead_id,
        subject=draft.subject,
        body=draft.body,
        open_questions=draft.open_questions,
    )

    db.add(draft_record)
    db.commit()
    db.refresh(draft_record)

    return draft_record
    
@router.get("/{lead_id}/draft-email", response_model=list[EmailDraftResponse])
def get_lead_email_drafts(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list[EmailDraftRecord]:
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if lead is None:
        raise HTTPException(status_code=404, detail="Lead not found.")

    return (
        db.query(EmailDraftRecord)
        .filter(EmailDraftRecord.lead_id == lead.id)
        .order_by(EmailDraftRecord.created_at.desc())
        .all()
    )