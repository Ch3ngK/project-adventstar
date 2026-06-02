"""Compatibility wrapper for the new session module."""

from app.db.session import SessionLocal, engine, get_db

__all__ = ["SessionLocal", "engine", "get_db"]
