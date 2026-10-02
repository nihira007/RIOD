import asyncio

from app.core.logger import logger

from app.core.prompts import SEARCH_QUERY_PROMPT
from app.models.schemas import (
    Paper,
    PaperSummary,
    ResearchUnderstanding,
)
from app.providers.llm.llm_provider import LLMProvider
from app.providers.literature.orchestrator import (
    LiteratureOrchestrator,
)


class RetrievalService:

    def __init__(
        self,
        literature: LiteratureOrchestrator,
        llm: LLMProvider,
    ):

        self.literature = literature
        self.llm = llm

    async def retrieve(
        self,
        understanding: ResearchUnderstanding,
    ) -> list[Paper]:

        idea = f"""
Domain:
{understanding.domain}

Problem:
{understanding.research_problem}

Objective:
{understanding.research_objective}

Methodology:
{understanding.methodology}

Keywords:
{', '.join(understanding.keywords)}
"""

        prompt = SEARCH_QUERY_PROMPT.replace(
            "{idea}",
            idea,
        )

        response = self.llm.generate_json(
            prompt
        )

        queries = response["queries"][:3]

        logger.info(
            f"Using {len(queries)} search queries."
        )

        # -------------------------------------------------
        # Run literature searches concurrently
        # -------------------------------------------------

        tasks = []

        for query in queries:

            logger.info(
                f"Searching: {query}"
            )

            tasks.append(
                self.literature.search(
                    query,
                    max_results=5,
                )
            )

        results = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )

        # -------------------------------------------------
        # Collect successful results
        # -------------------------------------------------

        papers = []

        for result in results:

            if isinstance(result, Exception):

                logger.warning(
                    f"Literature search failed: {result}"
                )

                continue

            papers.extend(result)

        # -------------------------------------------------
        # Remove duplicates
        # -------------------------------------------------

        papers = self._remove_duplicates(
            papers
        )

        logger.info(
            f"Retrieved {len(papers)} unique papers."
        )

        # -------------------------------------------------
        # Generate paper summaries
        # -------------------------------------------------

        logger.info(
            "Generating summaries..."
        )

        for paper in papers[:5]:

            self._generate_summary(
                paper
            )

        return papers

    # -----------------------------------------------------
    # Paper Summary
    # -----------------------------------------------------

    def _generate_summary(
        self,
        paper: Paper,
    ):

        prompt = f"""
You are an expert research assistant.

Analyze this research paper.

Title:
{paper.title}

Abstract:
{paper.abstract}

Return ONLY JSON.

{{
    "objective":"",
    "methodology":"",
    "key_contributions":[
        "",
        "",
        ""
    ],
    "why_it_matters":""
}}
"""

        try:

            response = self.llm.generate_json(
                prompt
            )

            print(response)

            paper.summary = PaperSummary(
                **response
            )

        except Exception as e:

            logger.warning(
                f"Paper summary generation failed: {e}"
            )

    # -----------------------------------------------------
    # Remove Duplicates
    # -----------------------------------------------------

    def _remove_duplicates(
        self,
        papers: list[Paper],
    ) -> list[Paper]:

        unique = {}

        for paper in papers:

            key = paper.title.lower().strip()

            if key not in unique:

                unique[key] = paper

                continue

            existing = unique[key]

            if (
                (paper.citations or 0)
                >
                (existing.citations or 0)
            ):

                unique[key] = paper

        return list(unique.values())