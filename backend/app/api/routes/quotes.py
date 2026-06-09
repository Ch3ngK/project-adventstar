from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Customer, Enquiry, Quote
from app.schemas import QuoteCreate, QuoteResponse, QuoteStatusUpdate

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

    if enquiry.customer_id != customer.id:
        raise HTTPException(
            status_code=400,
            detail="Enquiry does not belong to this customer.",
        )
    
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


@router.get("", response_model=list[QuoteResponse])
def get_quotes(db: Session = Depends(get_db)) -> list[QuoteResponse]:
    return db.query(Quote).all()

@router.get("/{quote_id}", response_model=QuoteResponse)
def get_quote(quote_id: int, db: Session = Depends(get_db)) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()

    if quote is None:
        raise HTTPException(status_code=404, detail="Quote not found.")

    return quote


@router.patch("/{quote_id}/status", response_model=QuoteResponse)
def update_quote_status(
    quote_id: int,
    status_update: QuoteStatusUpdate,
    db: Session = Depends(get_db),
) -> Quote:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()

    if quote is None:
        raise HTTPException(status_code=404, detail="Quote not found.")

    quote.status = status_update.status
    db.commit()
    db.refresh(quote)

    return quote

@router.delete("/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_quote(
    quote_id: int, 
    db: Session = Depends(get_db)
) -> Response:
    quote = db.query(Quote).filter(Quote.id == quote_id).first()

    if quote is None:
        raise HTTPException(status_code=404, details="Quote not found.")
    
    db.delete(quote) 
    db.commit()
    
    return Response(status_code=status.HTTP_204_NO_CONTENT)