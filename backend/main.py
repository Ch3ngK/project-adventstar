"""Compatibility entry point for running the FastAPI app from the backend folder."""

from app.main import app
from app.api.routes.customers import router as customers_router
from app.api.routes.leads import router as leads_router

app.include_router(customers_router) 
app.include(leads_router)
