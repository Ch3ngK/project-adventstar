from datetime import datetime
from typing import Optional 

from pydantic import BaseModel, ConfigDict
#Inherit BaseModel class for validated data schema

class EnquiryCreate(BaseModel): #Request schema: describes what client must send when creating 'enquiry' 
    customer_name: str
    company_name: Optional[str] = None #allowed to be missing, else default to 'None'
    email: str
    phone: Optional[str] = None
    message: str

class EnquiryResponse(BaseModel): #Response schema: describes what API sends back after an enquiry is created/fetched
    model_config = ConfigDict(from_attributes=True) #Pydantic needs to know how to read model attributes
    id: int
    customer_name: str
    company_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    message: str
    status: str
    created_at: datetime

class EnquiryStatusUpdate(BaseModel): 
    status: str



