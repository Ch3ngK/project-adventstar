import argparse
import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import User


def create_admin(email: str, password: str) -> None:
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == email).first() is not None:
            raise SystemExit(f"A user with email '{email}' already exists.")

        user = User(email=email, hashed_password=hash_password(password), role="admin")
        db.add(user)
        db.commit()
        db.refresh(user)

        print(f"Created admin user id={user.id} email={user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create an admin user.")
    parser.add_argument("--email", help="Admin email. Prompted if omitted.")
    parser.add_argument("--password", help="Admin password. Prompted if omitted.")
    args = parser.parse_args()

    email = args.email or input("Email: ").strip()
    password = args.password or getpass.getpass("Password: ")

    if not email or not password:
        raise SystemExit("Email and password are required.")

    create_admin(email, password)
