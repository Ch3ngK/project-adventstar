from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.routes.customers import router as customers_router
from app.api.routes.enquiries import router as enquiries_router
from app.api.routes.quotes import router as quotes_router
from app.api.routes.orders import router as orders_router
from app.api.routes.auth import router as auth_router
from app.core.config import settings
from app.db.session import engine
from app.models import Enquiry  # noqa: F401


def create_application() -> FastAPI:
    app = FastAPI(title="Advent Star Backend")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/")
    def read_root() -> dict[str, str]:
        return {"message": "Advent Star Backend is running"}

    @app.get("/db-test")
    def test_database() -> dict[str, str]:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"message": "Database connection is successful"}

    app.include_router(customers_router)
    app.include_router(enquiries_router)
    app.include_router(quotes_router)
    app.include_router(orders_router)
    app.include_router(auth_router)

    return app


app = create_application()
