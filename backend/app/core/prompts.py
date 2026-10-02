IDEA_UNDERSTANDING_PROMPT = """
You are an expert AI research advisor.

Analyze the following research idea and return ONLY valid JSON.

Research Idea:
{idea}

Return this exact JSON format:

{{
    "domain": "",
    "research_problem": "",
    "research_objective": "",
    "methodology": "",
    "application_area": "",
    "data_type": "",
    "keywords": [],
    "research_questions": [],
    "expected_contribution": ""
}}

Rules:
- Return ONLY JSON.
- Do not include markdown.
- Do not explain your answer.
"""

SEARCH_QUERY_PROMPT = """
You are an expert research assistant.

Given the research idea below, generate 8 high-quality literature search queries.

Research Idea:

{idea}

Rules:

- Return ONLY JSON.
- No explanation.
- Queries should maximize literature retrieval.
- Include synonyms.
- Include methodology.
- Include application area.
- Include related keywords.

Return JSON:

{{
    "queries": [
        "...",
        "...",
        "..."
    ]
}}
"""

NOVELTY_PROMPT = """
You are an expert research evaluator.

Research Idea

{idea}

Most Similar Papers

{papers}

The semantic similarity score between the idea and existing literature is:

{score}

Return ONLY JSON.

{{}
    "level":"",
    "explanation":""
}}
"""

SATURATION_PROMPT = """
You are an expert research analyst.

Research Area

{idea}

Statistics

Total Papers:
{total}

Recent Papers:
{recent}

Average Citations:
{citations}

Growth Rate:
{growth}

Saturation Score:
{score}

Return ONLY JSON.

{{}
    "level":"",
    "confidence":0,
    "explanation":""
}}
"""
RESEARCH_GAP_PROMPT = """
You are a senior IEEE researcher.

Your task is to perform a literature review.

You have been given:

1. Research Idea

2. Retrieved papers

-----------------------------------------------------

FIRST

Write an AI-generated literature synthesis.

Explain

• overall research landscape

• dominant methodologies

• important findings

• current limitations

• future research direction

• overall opportunity

-----------------------------------------------------

SECOND

Identify the TOP FIVE research gaps.

Every gap must be supported by multiple papers.

Rank them.

-----------------------------------------------------

Return ONLY JSON.

{{
    "ai_summary": {{
        "summary": "...",
        "importance": "..."
    }},

    "gaps": [

        {{
            "title": "",

            "category": "",

            "score": 0,

            "confidence": 0,

            "novelty": 0,

            "impact": 0,

            "feasibility": 0,

            "evidence": 0,

            "explanation": "",

            "research_opportunity": "",

            "supporting_papers": [
                "",
                ""
            ],

            "evidence_points": [
                "",
                "",
                ""
            ]
        }}

    ]
}}

Return ONLY JSON.
"""