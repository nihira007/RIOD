from __future__ import annotations

from app.framework.confidence import (
    ConfidenceEngine,
    ConfidenceFactors,
)

from app.framework.evidence import (
    EvidenceCollector,
)

from app.framework.scoring import (
    RISFMetric,
)

from app.models.schemas import (
    Paper,
    ResearchUnderstanding,
)

from app.services.trend.publication_trend import (
    PublicationTrend,
)

from app.services.trend.keyword_extractor import (
    KeywordExtractor,
)

from app.services.trend.keyword_evolution import (
    KeywordEvolution,
)

from app.services.trend.topic_evolution import (
    TopicEvolution,
)

from app.services.trend.forecasting import (
    TrendForecasting,
)

from app.services.trend.emerging_topics import (
    EmergingTopics,
)


class TrendService:

    WEIGHTS = {

        "publication": 0.25,

        "keyword": 0.15,

        "topic": 0.20,

        "forecast": 0.20,

        "emerging": 0.20,

    }

    def __init__(self):

        self.publication = PublicationTrend()

        self.extractor = KeywordExtractor()

        self.keyword = KeywordEvolution()

        self.topic = TopicEvolution()

        self.forecasting = TrendForecasting()

        self.emerging = EmergingTopics()

        self.confidence_engine = ConfidenceEngine()

    # ------------------------------------------------------------

    async def analyze(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> RISFMetric:

        collector = EvidenceCollector()

        ##########################################################
        # Publication Trend
        ##########################################################

        publication = self.publication.compute(
            papers
        )

        collector.add(

            title="Publication Trend",

            description=publication["reasoning"],

            source="Publication Analysis",

            confidence=0.95,

        )

        ##########################################################
        # Keyword Extraction
        ##########################################################

        keywords = self.extractor.compute(
            papers
        )

        collector.add(

            title="Keyword Extraction",

            description=f'{keywords["total_keywords"]} keywords extracted.',

            source="Keyword Analysis",

            confidence=0.90,

        )

        ##########################################################
        # Keyword Evolution
        ##########################################################

        keyword_evolution = self.keyword.compute(
            papers
        )

        collector.add(

            title="Keyword Evolution",

            description=keyword_evolution["reasoning"],

            source="Keyword Trend",

            confidence=0.90,

        )

        ##########################################################
        # Topic Evolution
        ##########################################################

        topic = self.topic.compute(
            papers
        )

        collector.add(

            title="Topic Evolution",

            description=topic["reasoning"],

            source="Topic Analysis",

            confidence=0.90,

        )

        ##########################################################
        # Forecast
        ##########################################################

        forecast = self.forecasting.compute(
            papers
        )

        collector.add(

            title="Forecast",

            description=forecast["reasoning"],

            source="Forecast Engine",

            confidence=forecast["confidence"],

        )

        ##########################################################
        # Emerging Topics
        ##########################################################

        emerging = self.emerging.compute(

            keyword_evolution,

            topic,

            forecast,

        )

        collector.add(

            title="Emerging Topics",

            description=emerging["reasoning"],

            source="Trend Discovery",

            confidence=0.90,

        )

        ##########################################################
        # Final Score
        ##########################################################

        keyword_score = min(

            len(
                keyword_evolution["top_growing"]
            ) * 5,

            100,

        )

        topic_score = min(

            len(
                topic["top_topics"]
            ) * 8,

            100,

        )

        forecast_score = min(

            forecast["confidence"] * 100,

            100,

        )

        emerging_score = min(

            len(
                emerging["emerging_topics"]
            ) * 5,

            100,

        )

        score = (

            publication["score"]

            * self.WEIGHTS["publication"]

            +

            keyword_score

            * self.WEIGHTS["keyword"]

            +

            topic_score

            * self.WEIGHTS["topic"]

            +

            forecast_score

            * self.WEIGHTS["forecast"]

            +

            emerging_score

            * self.WEIGHTS["emerging"]

        )

        ##########################################################
        # Confidence
        ##########################################################

        confidence = self.confidence_engine.compute(

            ConfidenceFactors(

                data_quality=0.90,

                evidence_strength=0.92,

                literature_coverage=min(

                    len(papers) / 50,

                    1,

                ),

                consistency=0.90,

                recency=0.95,

            )

        )

        ##########################################################

        collector.deduplicate()

        return RISFMetric(

            name="Trend",

            score=round(

                score,

                2,

            ),

            confidence=confidence,

            reasoning=(

                "Trend score computed using the "

                "Research Trend Engine (RTE)."

            ),

            evidence=collector.top(10),

            metadata={

                "publication": publication,

                "keywords": keywords,

                "keyword_evolution": keyword_evolution,

                "topic_evolution": topic,

                "forecast": forecast,

                "emerging_topics": emerging,

            },

        )