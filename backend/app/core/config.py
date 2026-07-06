import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise ValueError("DATABASE_URL is not set.")

        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            raise ValueError("SECRET_KEY is not set.")

        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key: 
            raise ValueError("OPENAI_API_KEY is not set.")
        
        self.database_url = database_url
        self.secret_key = secret_key
        self.openai_api_key = openai_api_key
        self.allowed_cors_origins = [
            os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
        ]


settings = Settings()
