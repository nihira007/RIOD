from app.core.logger import logger
from typing import List

import arxiv

from app.models.schemas import Paper
from app.providers.literature.base import BaseLiteratureProvider


class ArxivProvider(BaseLiteratureProvider):

    def __init__(self):

        self.client = arxiv.Client(
            page_size=10,
            delay_seconds=3.0,
            num_retries=1,
        )

    async def search(
        self,
        query: str,
        max_results: int = 10,
    ) -> List[Paper]:

        papers = []

        try:

            search = arxiv.Search(
                query=query,
                max_results=max_results,
                sort_by=arxiv.SortCriterion.Relevance,
            )

            for result in self.client.results(search):

                papers.append(
                    Paper(
                        title=result.title,
                        authors=[
                            a.name
                            for a in result.authors
                        ],
                        abstract=result.summary,
                        year=result.published.year,
                        source="arXiv",
                        url=result.entry_id,
                        citations=None,
                    )
                )

        except Exception as e:

            logger.exception(
                f"arXiv search failed for query: {query}. Error: {e}"
            )

        return papers