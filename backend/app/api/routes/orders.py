from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models import Customer, Enquiry, Quote, Order, User
from app.schemas import OrderCreate, OrderResponse, OrderStatusUpdate

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("", response_model=OrderResponse)
def create_order(
    order: OrderCreate, 
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Order:
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()

    if customer is None: 
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    quote = db.query(Quote).filter(Quote.id == order.quote_id).first()
    
    if quote is None: 
        raise HTTPException(status_code=404, detail="Quote not found.")
    
    if quote.customer_id != customer.id:
        raise HTTPException(status_code=400, detail="Quote does not belong to this customer.")

    if quote.status != "approved":
        raise HTTPException(status_code=400, detail="Only approved quotes can be converted to orders.")

    existing_order = db.query(Order).filter(Order.quote_id == quote.id).first()
    
    if existing_order is not None:
        raise HTTPException(
            status_code=400,
            detail="An order already exists for this quotation."
        )
    
    new_order = Order(
            customer_id=customer.id,
            quote_id=quote.id,
            notes=order.notes,
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> list[Order]:
    return db.query(Order).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None: 
        raise HTTPException(status_code=404, detail="Order not found.")
    
    return order 

@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int, 
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    order.status = status_update.status
    db.commit()
    db.refresh(order)
    
    return order

@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT) 
def delete_order(
    order_id: int, 
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
) -> Response: 
    order = db.query(Order).filter(Order.id == order_id).first()

    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")
    
    db.delete(order)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
