#Webapp entry point
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from models import Base, Enquiry
from database import engine, get_db
from schemas import EnquiryCreate, EnquiryResponse

Base.metadata.create_all(bind=engine) #Creates all missing database tables defined by my SQLAlchemy models in PostgreSQL

app = FastAPI()

@app.get("/")        #route decorator
def read_root():
    return {"message": "Advent Star Backend is running"}

@app.get("/db-test")
def test_database(): 
    with engine.connect() as connection: 
        connection.execute(text("SELECT 1"))
    return {"message": "Database connection is successful"}

@app.post("/enquiries", response_model=EnquiryResponse)
def create_enquiry(enquiry: EnquiryCreate, db: Session = Depends(get_db)): 
    new_enquiry =  Enquiry(
        customer_name=enquiry.customer_name, 
        company_name=enquiry.company_name,
        email=enquiry.email,
        phone=enquiry.phone,
        message=enquiry.message,
    )

    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    return new_enquiry

@app.get("/enquiries", response_model=list[EnquiryResponse])
def get_enquiries(db: Session = Depends(get_db)): 
    enquiries = db.query(Enquiry).all() 
    return enquiries 

@app.get("/enquiries/{enquiry_id}", response_model=EnquiryResponse)
def get_enquiry(enquiry_id: int, db: Session = Depends(get_db)): 
    enquiry = db.query(Enquiry).filter(Enquiry.id == enquiry_id).first() #.first() for the first result

    if enquiry is None:
        raise HTTPException(status_code=404, detail="Enquiry not found")

    return enquiry