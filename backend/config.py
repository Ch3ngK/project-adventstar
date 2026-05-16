#Settings: load.env and read DATABASE_URL
import os #Allows python read environment variables

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")