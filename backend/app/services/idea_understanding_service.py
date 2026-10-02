from app.core.logger import logger

from pydantic import ValidationError

from app.core.prompts import IDEA_UNDERSTANDING_PROMPT
from app.models.schemas import (
    ResearchIdea,
    ResearchUnderstanding,
)
from app.providers.llm.llm_provider import LLMProvider



class IdeaUnderstandingService:

    def __init__(
        self,
        llm: LLMProvider,
    ):
        self.llm = llm

    async def analyze(
        self,
        idea: ResearchIdea,
    ) -> ResearchUnderstanding:

        idea_text = f"""
        Title:
        {idea.title}

        Description:
        {idea.description}
        """

        prompt = IDEA_UNDERSTANDING_PROMPT.replace(
            "{idea}",
            idea_text
        )

        response = self.llm.generate_json(
            prompt,
            provider="groq",
        )

        try:

            understanding = ResearchUnderstanding(
                **response
            )

            return understanding

        except ValidationError as e:

            logger.exception(e)

            raise