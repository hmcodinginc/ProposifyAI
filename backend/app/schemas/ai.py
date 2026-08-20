from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RequirementAnalysisRequest(BaseModel):
    raw_requirements: str
    client_name: Optional[str] = None
    client_industry: Optional[str] = None
    target_budget: Optional[float] = None
    target_timeline_days: Optional[int] = None

class FeatureItem(BaseModel):
    title: str
    description: str
    complexity: str  # low, medium, high
    estimated_hours: float

class MissingInfoItem(BaseModel):
    category: str
    question: str
    reason: str

class RequirementAnalysisResponse(BaseModel):
    project_type: str
    summary: str
    extracted_features: List[FeatureItem]
    missing_information: List[MissingInfoItem]
    clarifying_questions: List[str]
    suggested_hourly_rate: float

class QuestionsAnswerRequest(BaseModel):
    raw_requirements: str
    answers: Dict[str, str]

class QuestionsAnswerResponse(BaseModel):
    updated_summary: str
    confirmed_scope: List[str]

class ProposalGenerationRequest(BaseModel):
    client_id: Optional[str] = None
    title: str
    raw_requirements: str
    project_type: str
    extracted_features: List[FeatureItem]
    answers: Optional[Dict[str, str]] = None
    hourly_rate: float = 75.0

class GeneratedSection(BaseModel):
    section_type: str
    title: str
    content: str
    order_index: int

class GeneratedPricingItem(BaseModel):
    title: str
    description: str
    hours: float
    rate: float
    amount: float
    milestone: str
    order_index: int

class ProposalGenerationResponse(BaseModel):
    title: str
    project_type: str
    executive_summary: str
    total_price: float
    estimated_duration_days: int
    hourly_rate: float
    sections: List[GeneratedSection]
    pricing_items: List[GeneratedPricingItem]
