from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Customer, Enquiry, Quote, Order
from app.schemas import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse)
def create_order(
    order: OrderCreate, 
    db: Session = Depends(get_db),
) -> Order:
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()

    if customer is None: 
        raise HTTPException(status_code=404, details="Customer not found.")
    
    quote = db.query(Quote).filter(Quote.id == order.quote_id).first()
    
    if quote is None: 
        raise HTTPException(status_code=404, details="Quote not found.")
    
    if quote.customer_id != customer.id:
        raise HTTPException(status_code=400, details="Quote does not belong to this customer.")

    if quote.status != "approved":
        raise HTTPException(status_code=400, details="Only approved quotes can be converted to orders.")

    new_order = Order(
            customer_id=customer.id,
            quote_id=quote.id,
            notes=order.notes,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return new_order

