from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime

class ProposalSectionBase(BaseModel):
    section_type: str
    title: str
    content: str
    order_index: int = 0

class ProposalSectionCreate(ProposalSectionBase):
    pass

class ProposalSectionResponse(ProposalSectionBase):
    id: str
    proposal_id: str

    model_config = ConfigDict(from_attributes=True)

class PricingItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    hours: float = 0.0
    rate: float = 0.0
    amount: float = 0.0
    milestone: Optional[str] = None
    order_index: int = 0

class PricingItemCreate(PricingItemBase):
    pass

class PricingItemResponse(PricingItemBase):
    id: str
    proposal_id: str

    model_config = ConfigDict(from_attributes=True)

class ProposalVersionResponse(BaseModel):
    id: str
    version_number: int
    data: Any
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProposalViewResponse(BaseModel):
    id: str
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None
    viewed_at: datetime
    action_taken: str
    feedback: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProposalCreate(BaseModel):
    title: str
    client_id: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[str] = "draft"
    total_price: Optional[float] = 0.0
    currency: Optional[str] = "USD"
    estimated_duration_days: Optional[int] = 30
    hourly_rate: Optional[float] = 75.0
    sections: Optional[List[ProposalSectionCreate]] = []
    pricing_items: Optional[List[PricingItemCreate]] = []

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    client_id: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[str] = None
    total_price: Optional[float] = None
    currency: Optional[str] = None
    estimated_duration_days: Optional[int] = None
    hourly_rate: Optional[float] = None
    sections: Optional[List[ProposalSectionCreate]] = None
    pricing_items: Optional[List[PricingItemCreate]] = None

class ProposalResponse(BaseModel):
    id: str
    user_id: str
    client_id: Optional[str] = None
    title: str
    project_type: Optional[str] = None
    status: str
    total_price: float
    currency: str
    estimated_duration_days: int
    hourly_rate: float
    token: str
    created_at: datetime
    updated_at: datetime
    sections: List[ProposalSectionResponse] = []
    pricing_items: List[PricingItemResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ProposalPublicResponse(BaseModel):
    id: str
    title: str
    project_type: Optional[str] = None
    status: str
    total_price: float
    currency: str
    estimated_duration_days: int
    hourly_rate: float
    token: str
    created_at: datetime
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    client_name: Optional[str] = None
    client_company: Optional[str] = None
    sections: List[ProposalSectionResponse] = []
    pricing_items: List[PricingItemResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ShareProposalRequest(BaseModel):
    share_email: Optional[str] = None
    note: Optional[str] = None

class ShareProposalResponse(BaseModel):
    share_url: str
    token: str

class PublicProposalActionRequest(BaseModel):
    action: str
    feedback: Optional[str] = None
