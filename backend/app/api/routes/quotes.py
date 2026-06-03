from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Customer, Enquiry, Quote
from app.schemas import EnquiryCreate, QuoteCreate, QuoteResponse

router = APIRouter(prefix="/quotes", tags=["quotes"])

@router.post("", response_model=QuoteResponse)
def create_quote(
    quote: QuoteCreate, db: Session = Depends(get_db)
    ) -> Quote:
    customer = db.query(Customer).filter(Customer.id == quote.customer_id).first()

    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    enquiry = db.query(Enquiry).filter(Enquiry.id == quote.enquiry_id).first()

    if enquiry is None: 
        raise HTTPException(status_code=404, detail = "Enquiry not found.")
    
    new_quote = Quote(
        customer_id=quote.customer_id,
        enquiry_id=quote.enquiry_id,
        total_amount=quote.total_amount,
        notes=quote.notes,
    )

    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)

    return new_quote


@router.get("", response_model=List[QuoteResponse])
def get_quotes(db: Session = Depends(get_db)) -> list[QuoteResponse]:
    return db.query(Quote).all()

@router.get("/{quote_id}", response_model=QuoteResponse)
def get_quote(quote_id: int, db: Session = Depends(get_db)) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()

    return quote