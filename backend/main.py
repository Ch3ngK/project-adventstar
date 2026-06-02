"""Compatibility entry point for running the FastAPI app from the backend folder."""

from app.main import app
from app.api.routes.customers import router as customers_router

app.include_router(customers_router) 

