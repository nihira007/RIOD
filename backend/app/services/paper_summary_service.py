from urllib import response
from venv import logger

from app.models.schemas import Paper, PaperSummary
from app.providers.llm.llm_provider import LLMProvider


class PaperSummaryService:

    def __init__(self, llm: LLMProvider):
        self.llm = llm

    def summarize(self, paper: Paper) -> Paper:

        prompt = f"""
You are an expert research assistant.

Analyze the following research paper abstract and generate a structured summary.

Title:
{paper.title}

Abstract:
{paper.abstract}

Return ONLY valid JSON.

{{
    "objective": "",
    "methodology": "",
    "key_contributions": [
        "",
        "",
        ""
    ],
    "why_it_matters": ""
}}
"""

        response = self.llm.generate_json(prompt)

        response["title"] = paper.title

        paper.summary = PaperSummary(**response)

        return paper.summary
