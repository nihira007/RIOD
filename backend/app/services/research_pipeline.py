from __future__ import annotations

import time
import asyncio
from app.core.logger import logger

from app.framework.recommendation import RecommendationEngine
from app.framework.risf import RISF
from app.framework.simulator import ImprovementSimulator

from app.models.pipeline_result import (
    ResearchPipelineResult,
)
from app.models.schemas import ResearchIdea

from app.services.idea_understanding_service import (
    IdeaUnderstandingService,
)
from app.services.retrieval_service import (
    RetrievalService,
)

from app.services.novelty.novelty_service import (
    NoveltyService,
)

from app.services.saturation.saturation_service import (
    SaturationService,
)

from app.services.trend.trend_service import (
    TrendService,
)

from app.services.gap.gap_service import (
    GapService,
)
from app.services.executive_summary_service import ExecutiveSummary


class ResearchPipeline:

    def __init__(self):

        from app.providers.llm.llm_provider import LLMProvider
        from app.providers.embeddings.embedding_provider import EmbeddingProvider
        from app.providers.literature.orchestrator import LiteratureOrchestrator
        from app.services.paper_summary_service import PaperSummaryService

        self.llm = LLMProvider()

        embedding = EmbeddingProvider()

        literature = LiteratureOrchestrator()

        self.understanding = IdeaUnderstandingService(
            self.llm
        )

        self.retrieval = RetrievalService(
            literature,
            self.llm,
        )

        self.novelty = NoveltyService(
            embedding
        )

        self.saturation = SaturationService()

        self.trend = TrendService()

        self.gap = GapService()

        self.risf = RISF()
        self.recommendation = RecommendationEngine()
        self.simulator = ImprovementSimulator()
        self.paper_summary = PaperSummaryService(self.llm)
        
        self.executive_summary = ExecutiveSummary(self.llm)
        
    async def run(
         self,
            idea: ResearchIdea,
        ) -> ResearchPipelineResult:

            start = time.perf_counter()

            logger.info("STEP 1 : Idea Understanding")

            understanding = await self.understanding.analyze(
                idea
            )

            ####################################################

            logger.info("STEP 2 : Literature Retrieval")

            papers = await self.retrieval.retrieve(
                understanding
            )


            logger.info("STEP 2.5 : AI Paper Summaries")

            for paper in papers[:8]:
                self.paper_summary.summarize(paper)
            ####################################################

            logger.info("STEP 3 : Research Engines")

            novelty, saturation, trend, gap = await asyncio.gather(

                self.novelty.analyze(
                    understanding,
                    papers,
                ),

                self.saturation.analyze(
                    understanding,
                    papers,
                ),

                self.trend.analyze(
                    understanding,
                    papers,
                ),

                self.gap.analyze(
                    understanding,
                    papers,
                ),

            )

            ####################################################

            logger.info("STEP 4 : RISF")

            metrics = [novelty, saturation, trend, gap]

            # Remove failed engines
            metrics = [metric for metric in metrics if metric is not None]

            logger.info(
                f"Valid research metrics for RISF: "
                f"{[metric.name for metric in metrics]}"
            )

            risf = self.risf.evaluate(metrics)


            logger.info("STEP 5 : Recommendations")

            recommendations = self.recommendation.generate(
                metrics,
                risf
            )

            executive_summary = None
            """logger.info("STEP 5.5 : Executive Summary")

            executive_summary = await self.executive_summary.analyze(
                understanding=understanding,
                idea=idea,
                papers=papers,
                novelty=novelty,
                saturation=saturation,
                trend=trend,
                gap=gap,
                risf=risf,
                recommendations=recommendations,
            )
  """

            logger.info("STEP 6 : Simulation")

            simulation = self.simulator.simulate(
                metrics,
                recommendations
            )

            ####################################################

            logger.info("STEP 7 : Build Result")
            
            elapsed = time.perf_counter() - start

            logger.info(
                f"Pipeline completed in {elapsed:.2f} seconds."
            )

            return ResearchPipelineResult(

                understanding=understanding,

                papers=papers,

                novelty=novelty,

                saturation=saturation,

                trend=trend,

                gap=gap,

                risf=risf,

                executive_summary=executive_summary,


                recommendations=recommendations,

                simulation=simulation,

                metadata={

                    "execution_time": round(elapsed, 2),

                    "papers_retrieved": len(papers),

                    "version": "2.0.0",

                },

            )