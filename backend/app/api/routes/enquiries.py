from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Customer, Enquiry
from app.schemas import EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate

router = APIRouter(prefix="/enquiries", tags=["enquiries"])


@router.post("", response_model=EnquiryResponse)
def create_enquiry(
    enquiry: EnquiryCreate, db: Session = Depends(get_db)
) -> Enquiry:
    if enquiry.customer_id is not None:
        customer = (
            db.query(Customer)
            .filer(Customer.id == enquiry.customer_id)
            .first()
        )

        if customer is None: 
            raise HTTPException(status_code=404, detail="Customer not found.")

    new_enquiry = Enquiry(
        customer_name=enquiry.customer_name,
        company_name=enquiry.company_name,
        email=enquiry.email,
        phone=enquiry.phone,
        message=enquiry.message,
        customer_id=enquiry.customer_id,
    )

    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    return new_enquiry


@router.get("", response_model=list[EnquiryResponse])
def get_enquiries(db: Session = Depends(get_db)) -> list[Enquiry]:
    return db.query(Enquiry).all()


@router.get("/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(enquiry_id: int, db: Session = Depends(get_db)) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    return enquiry


@router.patch("/{enquiry_id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    enquiry_id: int,
    status_update: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
) -> Enquiry:
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first()

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    enquiry.status = status_update.status
    db.commit()
    db.refresh(enquiry)

    return enquiry
