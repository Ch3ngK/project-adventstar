"""Compatibility wrapper for the new schema modules."""

from app.schemas.enquiry import EnquiryCreate, EnquiryResponse, EnquiryStatusUpdate

__all__ = ["EnquiryCreate", "EnquiryResponse", "EnquiryStatusUpdate"]
