from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.research import router as research_router


app = FastAPI(
    title="Research Intelligence & Opportunity Discovery",
    description="AI-powered Research Intelligence Platform",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research_router)

@app.get("/")
async def root():

    return {

        "application": "Research Intelligence Platform",

        "version": "2.0.0",

        "status": "Running",

        "documentation": "/docs",

    }


@app.get("/health")
async def health():

    return {

        "status": "healthy",

        "version": "2.0.0",

        "services": {

            "pipeline": "available",

            "llm": "available",

            "literature": "available",

            "analysis": "available",

        }

    }