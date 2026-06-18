from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models import Customer, Enquiry, User
from app.schemas import EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate

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
