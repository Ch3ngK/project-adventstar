import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.core.security import get_current_user
from app.main import create_application
from app.models import User


## Special pytest file used to define shared test setup.
## Main purpose is to create a reusable client fixture:
engine = create_engine("sqlite:///:memory:",
                       connect_args={"check_same_thread": False},
                       poolclass=StaticPool)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)
    app = create_application()

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally: 
            db.close()

    def override_get_current_user():
        return User(id=1, email="admin@test.com")
    
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    yield TestClient(app)

    Base.metadata.drop_all(bind=engine)