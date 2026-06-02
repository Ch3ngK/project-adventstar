"""Compatibility wrapper for the new model modules."""

from app.db.base import Base
from app.models.enquiry import Enquiry

__all__ = ["Base", "Enquiry"]
