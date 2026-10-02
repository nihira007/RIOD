# Research Intelligence and Opportunity Discovery (RIOD)

RIOD is an AI-powered research intelligence platform designed to help researchers evaluate research ideas, analyze the existing research landscape, and discover potential research opportunities.

## Features

- Research idea understanding
- Scientific literature retrieval
- Semantic research analysis
- Novelty analysis
- Research saturation analysis
- Research trend analysis
- Research gap discovery
- AI-generated literature insights
- Evidence-based recommendations
- Research Intelligence Scoring Framework (RISF)
- Research opportunity discovery
- AI Research Assistant

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS  
**Backend:** Python, FastAPI  
**AI:** Gemini, Groq, NLP, LLMs, Semantic Embeddings  
**Literature Sources:** arXiv, OpenAlex

## Project Structure

```text
RIOD/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore
```

## How to Run

---
Add the required API credentials:
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Terminal 1 — Backend
```bash
cd RIOD/backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Terminal 2 — Frontend
```bash
cd RIOD/frontend
npm install
npm run dev
```

## Application Workflow

```text
Research Idea
      ↓
Research Idea Understanding
      ↓
Search Query Generation
      ↓
Scientific Literature Retrieval
      ↓
Semantic Analysis
      ↓
Novelty Analysis
      ↓
Saturation Analysis
      ↓
Trend Analysis
      ↓
Research Gap Discovery
      ↓
Literature Synthesis
      ↓
Research Intelligence Scoring Framework
      ↓
AI Recommendations
      ↓
Research Report
```

## Research Intelligence Scoring Framework (RISF)

RIOD combines key research intelligence dimensions to provide an overall assessment of a research idea.

The framework considers:

- **Novelty**
- **Research Gap**
- **Research Trend**
- **Research Saturation**

These dimensions are combined to generate a Research Intelligence Score that supports the overall research assessment and recommendations.
