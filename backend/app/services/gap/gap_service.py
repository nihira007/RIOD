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

from app.services.gap.evidence_extractor import (
    EvidenceExtractor,
)

from app.services.gap.claim_extractor import (
    ClaimExtractor,
)

from app.services.gap.methodology_extractor import (
    MethodologyExtractor,
)

from app.services.gap.limitation_miner import (
    LimitationMiner,
)

from app.services.gap.future_work_miner import (
    FutureWorkMiner,
)

from app.services.gap.contradiction_detector import (
    ContradictionDetector,
)

from app.services.gap.gap_ranker import (
    GapRanker,
)
from app.providers.llm.llm_provider import LLMProvider

from app.core.prompts import RESEARCH_GAP_PROMPT

class GapService:

    def __init__(self):

        self.evidence = EvidenceExtractor()

        self.claims = ClaimExtractor()

        self.methods = MethodologyExtractor()

        self.limitations = LimitationMiner()

        self.future = FutureWorkMiner()

        self.contradictions = ContradictionDetector()

        self.ranker = GapRanker()

        self.confidence_engine = ConfidenceEngine()

        self.llm = LLMProvider()
    # --------------------------------------------------------

    async def analyze(

        self,

        understanding: ResearchUnderstanding,

        papers: list[Paper],

    ) -> RISFMetric:

        collector = EvidenceCollector()

        ###################################################
        # Evidence
        ###################################################

        evidence = self.evidence.compute(
            papers
        )

        collector.add(

            title="Evidence Extraction",

            description=evidence["reasoning"],

            source="Literature",

            confidence=0.95,

        )

        ###################################################
        # Claims
        ###################################################

        claims = self.claims.compute(
            papers
        )

        collector.add(

            title="Claim Extraction",

            description=claims["reasoning"],

            source="Claims",

            confidence=0.90,

        )

        ###################################################
        # Methods
        ###################################################

        methods = self.methods.compute(
            papers
        )

        collector.add(

            title="Methodology",

            description=methods["reasoning"],

            source="Methods",

            confidence=0.90,

        )

        ###################################################
        # Limitations
        ###################################################

        limitations = self.limitations.compute(
            papers
        )

        collector.add(

            title="Limitations",

            description=limitations["reasoning"],

            source="Limitations",

            confidence=0.93,

        )

        ###################################################
        # Future Work
        ###################################################

        future = self.future.compute(
            papers
        )

        collector.add(

            title="Future Work",

            description=future["reasoning"],

            source="Future Work",

            confidence=0.90,

        )

        ###################################################
        # Contradictions
        ###################################################

        contradictions = self.contradictions.compute(
            papers
        )

        collector.add(

            title="Contradictions",

            description=contradictions["reasoning"],

            source="Contradiction Analysis",

            confidence=0.88,

        )
        
        papers_context = ""

        for p in papers[:10]:

            papers_context += f"""

        TITLE:
        {p.title}

        ABSTRACT:
        {p.abstract}

        KEYWORDS:
        {", ".join(p.keywords) if hasattr(p, "keywords") and p.keywords else "N/A"}

        CONTRIBUTION:
        {getattr(p, "summary", "")}

        """
        analysis_context = f"""

            Research Domain

            {understanding.domain}

            ---------------------------------

            Recurring Limitations

            {limitations["limitation_frequency"]}

            ---------------------------------

            Recurring Future Work

            {future["future_work_frequency"]}

            ---------------------------------

            Contradictions

            {contradictions["contradictions"]}

            ---------------------------------

            Methods

            {methods}

            ---------------------------------

            Top Papers

            {papers_context}

            """

        ###################################################
        # Build Candidate Gaps
        ###################################################
        prompt = RESEARCH_GAP_PROMPT.format(

            idea=f"""

        Domain:
        {understanding.domain}

        Research Problem:
        {understanding.research_problem}

        Objective:
        {understanding.research_objective}

        Methodology:
        {understanding.methodology}

        """,

            papers=analysis_context,

        )

        response = self.llm.generate_json(prompt)

        ai_summary = response.get("ai_summary", {})

        candidate_gaps = response.get("gaps", [])

        ranking = self.ranker.compute(candidate_gaps)
        ###################################################
        # Confidence
        ###################################################

        confidence = self.confidence_engine.compute(

            ConfidenceFactors(

                data_quality=0.91,

                evidence_strength=0.92,

                literature_coverage=min(

                    len(papers) / 50,

                    1,

                ),

                consistency=0.90,

                recency=0.95,

            )

        )

        ###################################################
        # Gap Score
        ###################################################

        if ranking["ranked_gaps"]:

            score = sum(

                gap.score

                for gap in ranking["ranked_gaps"]

            ) / len(

                ranking["ranked_gaps"]

            )

        else:

            score = 0

        ###################################################


        
        collector.deduplicate()

        return RISFMetric(

            name="Research Gap",

            score=round(score, 2),

            confidence=confidence,

            reasoning=(

                "Research opportunities identified using "

                "the Research Gap Discovery Engine (RGDE)."

            ),

            evidence=collector.top(10),

            metadata={

                "ai_summary": ai_summary,

                "evidence": evidence,

                "claims": claims,

                "methods": methods,

                "limitations": limitations,

                "future_work": future,

                "contradictions": contradictions,

                "ranking": ranking,

            },

        )