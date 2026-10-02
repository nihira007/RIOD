from app.core.logger import logger

from groq import Groq

from app.core.config import settings
from app.providers.llm.base import BaseLLMProvider



class GroqProvider(BaseLLMProvider):

    def __init__(self):

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

    def generate(
        self,
        prompt: str,
        temperature: float = 0.3,
    ) -> str:

        response = self.client.chat.completions.create(

            model=settings.GROQ_MODEL,

            temperature=temperature,

            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        return response.choices[0].message.content