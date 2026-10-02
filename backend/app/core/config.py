import os
from pathlib import Path

from dotenv import load_dotenv

# --------------------------------------------------
# Load .env
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BASE_DIR / ".env")


class Settings:
    """
    Global configuration for the Research Intelligence backend.
    """

    # ===============================================
    # Project
    # ===============================================

    PROJECT_NAME = "Research Intelligence API"

    VERSION = "1.0.0"

    DEBUG = os.getenv("DEBUG", "True").lower() == "true"

    # ===============================================
    # LLM
    # ===============================================

    DEFAULT_LLM = os.getenv("DEFAULT_LLM", "groq")

    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    
    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )

    # ===============================================
    # Embeddings
    # ===============================================

    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL",
        "sentence-transformers/all-MiniLM-L6-v2",
    )

    # ===============================================
    # Literature APIs
    # ===============================================

    MAX_PAPERS = int(
        os.getenv("MAX_PAPERS", 25)
    )

    ARXIV_ENABLED = True

    OPENALEX_ENABLED = True

    SEMANTIC_SCHOLAR_ENABLED = True

    # ===============================================
    # Similarity
    # ===============================================

    TOP_K = int(
        os.getenv("TOP_K", 10)
    )

    NOVELTY_THRESHOLD = float(
        os.getenv("NOVELTY_THRESHOLD", 0.75)
    )

    # ===============================================
    # CORS
    # ===============================================

    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


settings = Settings()