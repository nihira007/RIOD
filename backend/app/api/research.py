from fastapi import APIRouter

from app.models.api_response import APIResponse
from app.models.pipeline_result import ResearchPipelineResult
from app.models.schemas import ResearchIdea
from app.services.research_pipeline import ResearchPipeline

router = APIRouter(
    prefix="/research",
    tags=["Research Intelligence"],
)

pipeline = ResearchPipeline()


@router.post(
    "/analyze",
    response_model=APIResponse[ResearchPipelineResult],
)
async def analyze_research(
    idea: ResearchIdea,
):

    try:

        result = await pipeline.run(
            idea
        )

        return APIResponse(

            success=True,

            message="Research analysis completed successfully.",

            data=result,

        )

    except Exception as e:

        return APIResponse(

            success=False,

            message="Research analysis failed.",

            errors=[str(e)],

        )