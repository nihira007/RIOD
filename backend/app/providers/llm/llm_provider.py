import json
from app.core.logger import logger

from app.providers.llm.groq_provider import GroqProvider
from app.providers.llm.gemini_provider import GeminiProvider

from app.core.config import settings



class LLMProvider:

    def __init__(self):

        self.providers = {}

        if settings.GROQ_API_KEY:

            self.providers["groq"] = GroqProvider()

        if settings.GEMINI_API_KEY:

            self.providers["gemini"] = GeminiProvider()

    # -----------------------------------------------------

    def generate(
        self,
        prompt: str,
        provider: str | None = None,
        temperature: float = 0.3,
    ) -> str:

        provider = provider or settings.DEFAULT_LLM

        if provider not in self.providers:

            raise ValueError(
                f"{provider} provider not configured."
            )

        return self.providers[
            provider
        ].generate(
            prompt,
            temperature,
        )

    # -----------------------------------------------------

    def generate_json(
        self,
        prompt: str,
        provider: str | None = None,
        temperature: float = 0.3,
    ) -> dict:

        response = self.generate(

            prompt,

            provider,

            temperature,

        )

        response = (

            response

            .replace("```json", "")

            .replace("```", "")

            .strip()

        )

        try:

            return json.loads(
                response
            )

        except json.JSONDecodeError:

            logger.error(response)

            raise ValueError(
                "LLM returned invalid JSON."
            )