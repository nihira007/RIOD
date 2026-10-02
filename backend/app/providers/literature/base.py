from abc import ABC, abstractmethod
from typing import List

from app.models.schemas import Paper


class BaseLiteratureProvider(ABC):
    """
    Base class for all literature providers.
    """

    @abstractmethod
    async def search(
        self,
        query: str,
        max_results: int = 10,
    ) -> List[Paper]:
        """
        Search papers from a literature source.
        """
        pass