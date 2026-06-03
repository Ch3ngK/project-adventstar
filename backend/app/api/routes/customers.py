from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Customer
from app.schemas import CustomerCreate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["customers"]) # All routes in this file start with "/customers", FastAPI docs will group them under "customers"

@router.post("", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate, db: Session = Depends(get_db) # Depends() helps to prevent repeated code when initializing the database.
) -> Customer: 
    new_customer = Customer(
        name=customer.name,
        company_name=customer.company_name,
        email=customer.email,
        phone=customer.phone,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer) 

    return new_customer 

@router.get("", response_model=list[CustomerResponse])
def get_customers(db: Session = Depends(get_db)) -> list[Customer]:
    return db.query(Customer).all()

@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)) -> Customer:
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    
    if customer is None: 
        raise HTTPException(status_code=404, detail="Customer not found.")
    
    return customer