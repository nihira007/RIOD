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

from app.services.saturation.publication_density import (
    PublicationDensity,
)

from app.services.saturation.citation_density import (
    CitationDensity,
)

from app.services.saturation.venue_quality import (
    VenueQuality,
)

from app.services.saturation.research_velocity import (
    ResearchVelocity,
)

from app.services.saturation.competition_index import (
    CompetitionIndex,
)


class SaturationService:

    WEIGHTS = {

        "publication": 0.25,

        "citation": 0.20,

        "venue": 0.20,

        "velocity": 0.20,

        "competition": 0.15,

    }

    def __init__(self):

        self.publication = PublicationDensity()

        self.citation = CitationDensity()

        self.venue = VenueQuality()

        self.velocity = ResearchVelocity()

        self.competition = CompetitionIndex()

        self.confidence_engine = ConfidenceEngine()

    # -----------------------------------------------------

    async def analyze(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> RISFMetric:

        collector = EvidenceCollector()

        ###################################################
        # Publication Density
        ###################################################

        publication = self.publication.compute(
            papers
        )

        collector.add(

            title="Publication Density",

            description=publication["reasoning"],

            source="Publication Density",

            confidence=0.95,

        )

        ###################################################
        # Citation Density
        ###################################################

        citation = self.citation.compute(
            papers
        )

        collector.add(

            title="Citation Density",

            description=citation["reasoning"],

            source="Citation Analysis",

            confidence=0.90,

        )

        ###################################################
        # Venue Quality
        ###################################################

        venue = self.venue.compute(
            papers
        )

        collector.add(

            title="Venue Quality",

            description=venue["reasoning"],

            source="Venue Analysis",

            confidence=0.88,

        )

        ###################################################
        # Research Velocity
        ###################################################

        velocity = self.velocity.compute(
            papers
        )

        collector.add(

            title="Research Velocity",

            description=velocity["reasoning"],

            source="Trend Analysis",

            confidence=0.92,

        )

        ###################################################
        # Competition
        ###################################################

        competition = self.competition.compute(
            papers
        )

        collector.add(

            title="Competition Index",

            description=competition["reasoning"],

            source="Competition Analysis",

            confidence=0.87,

        )

        ###################################################
        # Final Score
        ###################################################

        score = (

            publication["score"]

            * self.WEIGHTS["publication"]

            +

            citation["score"]

            * self.WEIGHTS["citation"]

            +

            venue["score"]

            * self.WEIGHTS["venue"]

            +

            velocity["score"]

            * self.WEIGHTS["velocity"]

            +

            competition["score"]

            * self.WEIGHTS["competition"]

        )

        ###################################################
        # Confidence
        ###################################################

        confidence = self.confidence_engine.compute(

            ConfidenceFactors(

                data_quality=0.92,

                evidence_strength=0.90,

                literature_coverage=min(

                    len(papers) / 50,

                    1,

                ),

                consistency=0.91,

                recency=0.95,

            )

        )

        ###################################################
        # Final Metric
        ###################################################

        collector.deduplicate()

        return RISFMetric(

            name="Saturation",

            score=round(score, 2),

            confidence=confidence,

            reasoning=(

                "Research saturation computed using the "

                "Research Saturation Engine (RSE)."

            ),

            evidence=collector.top(10),

            metadata={

                "publication_density": publication,

                "citation_density": citation,

                "venue_quality": venue,

                "research_velocity": velocity,

                "competition_index": competition,

            },

        )