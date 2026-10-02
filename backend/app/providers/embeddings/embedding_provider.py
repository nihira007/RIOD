from app.core.logger import logger
from typing import List

import numpy as np
from sentence_transformers import SentenceTransformer

from app.core.config import settings

import torch

class EmbeddingProvider:

    def __init__(self):

        self.model = None
        self.available = False

        try:
            self._load()
            self.available = True

        except Exception as e:

            logger.warning(
                f"Embedding model unavailable: {e}"
            )

            self.available = False

    # -------------------------------------------------

    def _load(self):

        if self.model is None:

            logger.info("Loading embedding model...")

            device = "cuda" if torch.cuda.is_available() else "cpu"

            self.model = SentenceTransformer(

                settings.EMBEDDING_MODEL,

                device=device,

                cache_folder="./models",

            )

            logger.info(
                f"Embedding model loaded on {device}."
            )
    # -------------------------------------------------

    def encode(
        self,
        text: str,
    ) -> np.ndarray:

        self._load()

        embedding = self.model.encode(

            text,

            normalize_embeddings=True,

        )

        return np.asarray(
            embedding,
            dtype=np.float32,
        )

    # -------------------------------------------------

    def encode_batch(
        self,
        texts: List[str],
    ) -> np.ndarray:

        self._load()

        embeddings = self.model.encode(

            texts,

            normalize_embeddings=True,

        )

        return np.asarray(

            embeddings,

            dtype=np.float32,

        )