import asyncio
from app.core.logger import logger
from typing import List

import httpx

from app.models.schemas import Paper
from app.providers.literature.base import BaseLiteratureProvider




class OpenAlexProvider(BaseLiteratureProvider):

    BASE_URL = "https://api.openalex.org/works"

    def __init__(self):

        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(15.0)
        )

    async def search(
        self,
        query: str,
        max_results: int = 10,
    ) -> List[Paper]:

        try:

            response = await asyncio.wait_for(

                self.client.get(

                    self.BASE_URL,

                    params={
                        "search": query,
                        "per-page": max_results,
                    },

                ),

                timeout=15,

            )

            response.raise_for_status()

            data = response.json()

            papers = []

            for work in data.get("results", []):

                papers.append(

                    Paper(

                        title=work.get(
                            "display_name",
                            "",
                        ),

                        authors=[
                            author["author"]["display_name"]

                            for author in work.get(
                                "authorships",
                                [],
                            )
                        ],

                        abstract="",

                        year=work.get(
                            "publication_year"
                        ),

                        source="OpenAlex",

                        url=work.get("id"),

                        citations=work.get(
                            "cited_by_count",
                            0,
                        ),

                    )

                )

            return papers

        except asyncio.TimeoutError:

            logger.warning(
                "OpenAlex timed out."
            )

            return []

        except Exception as e:

            logger.exception(e)

            return []

    async def close(self):

        await self.client.aclose()