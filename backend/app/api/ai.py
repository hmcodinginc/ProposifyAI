from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, AIJob
from app.schemas.ai import (
    RequirementAnalysisRequest,
    RequirementAnalysisResponse,
    QuestionsAnswerRequest,
    QuestionsAnswerResponse,
    ProposalGenerationRequest,
    ProposalGenerationResponse
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Engine"])

@router.post("/analyze", response_model=RequirementAnalysisResponse)
async def analyze_requirements(
    req_in: RequirementAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Record AI Job
    job = AIJob(
        user_id=current_user.id,
        job_type="analyze",
        status="processing",
        input_data=req_in.model_dump()
    )
    db.add(job)
    db.commit()

    try:
        res = await AIService.analyze_requirements(
            raw_requirements=req_in.raw_requirements,
            client_name=req_in.client_name,
            client_industry=req_in.client_industry
        )
        job.status = "completed"
        job.result = res.model_dump()
        db.commit()
        return res
    except Exception as e:
        job.status = "failed"
        job.error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"AI Requirement Analysis failed: {str(e)}")

@router.post("/questions", response_model=QuestionsAnswerResponse)
async def submit_answers(
    ans_in: QuestionsAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    confirmed_scope = []
    for q, a in ans_in.answers.items():
        if a.strip():
            confirmed_scope.append(f"Confirmed preference for '{q}': {a}")
    
    updated_summary = f"Requirements clarified with {len(confirmed_scope)} custom inputs."
    return QuestionsAnswerResponse(
        updated_summary=updated_summary,
        confirmed_scope=confirmed_scope
    )

@router.post("/generate", response_model=ProposalGenerationResponse)
async def generate_proposal(
    gen_in: ProposalGenerationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = AIJob(
        user_id=current_user.id,
        job_type="generate",
        status="processing",
        input_data=gen_in.model_dump()
    )
    db.add(job)
    db.commit()

    try:
        res = await AIService.generate_proposal(
            title=gen_in.title,
            project_type=gen_in.project_type,
            raw_requirements=gen_in.raw_requirements,
            features=gen_in.extracted_features,
            answers=gen_in.answers,
            hourly_rate=gen_in.hourly_rate
        )
        job.status = "completed"
        job.result = res.model_dump()
        db.commit()
        return res
    except Exception as e:
        job.status = "failed"
        job.error = str(e)
        db.commit()
        raise HTTPException(status_code=500, detail=f"AI Proposal Generation failed: {str(e)}")
