import asyncio
from app.core.logger import logger
from typing import List

from app.models.schemas import Paper

from app.providers.literature.arxiv_provider import ArxivProvider
from app.providers.literature.openalex_provider import OpenAlexProvider


class LiteratureOrchestrator:

    def __init__(self):

        self.providers = [
            ArxivProvider(),
            OpenAlexProvider(),
        ]

    async def search(
        self,
        query: str,
        max_results: int = 10,
    ) -> List[Paper]:

        # Prevent excessive requests
        max_results = min(max_results, 10)

        tasks = [

            provider.search(
                query,
                max_results
            )

            for provider in self.providers

        ]

        results = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )

        papers = []

        for provider, result in zip(
            self.providers,
            results
        ):

            if isinstance(result, Exception):

                logger.warning(
                    f"{provider.__class__.__name__} failed: {result}"
                )

                continue

            papers.extend(result)

        papers = self.remove_duplicates(papers)

        papers = self.rank_results(papers)

        # Final safety limit
        return papers[:max_results]

    # -----------------------------------------------------

    def remove_duplicates(
        self,
        papers: List[Paper]
    ) -> List[Paper]:

        unique = {}

        for paper in papers:

            key = (
                paper.title
                .strip()
                .lower()
            )

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

    # -----------------------------------------------------

    def rank_results(
        self,
        papers: List[Paper]
    ) -> List[Paper]:

        papers.sort(

            key=lambda x: (
                x.citations or 0,
                x.year or 0
            ),

            reverse=True,

        )

        return papers

    # -----------------------------------------------------

    async def close(self):

        for provider in self.providers:

            if hasattr(provider, "close"):

                await provider.close()