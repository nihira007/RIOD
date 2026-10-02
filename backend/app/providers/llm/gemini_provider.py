from app.core.logger import logger

import google.generativeai as genai

from app.core.config import settings
from app.providers.llm.base import BaseLLMProvider


class GeminiProvider(BaseLLMProvider):

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)

        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL
        )

    def generate(
        self,
        prompt: str,
        temperature: float = 0.3,
    ) -> str:

        response = self.model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=temperature
            ),
        )

        return response.text