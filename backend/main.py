#Webapp entry point
from fastapi import FastAPI
from sqlalchemy import text

from database import engine

app = FastAPI()

@app.get("/")        #route decorator
def read_root():
    return {"message": "Advent Star Backend is running"}

@app.get("/db-test")
def test_database(): 
    with engine.connect() as connection: 
        connection.execute(text("SELECT 1"))
    return {"message": "Database connection is successful"}