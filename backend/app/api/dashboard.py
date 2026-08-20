from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Proposal, Client
from app.schemas.proposal import ProposalResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

class DashboardStats(BaseModel):
    total_proposals: int
    draft_proposals: int
    sent_proposals: int
    accepted_proposals: int
    changes_requested_proposals: int
    total_clients: int
    recent_proposals: List[ProposalResponse]

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposals = db.query(Proposal).filter(Proposal.user_id == current_user.id).all()
    clients_count = db.query(Client).filter(Client.user_id == current_user.id).count()

    total = len(proposals)
    drafts = sum(1 for p in proposals if p.status == "draft")
    sent = sum(1 for p in proposals if p.status == "sent")
    accepted = sum(1 for p in proposals if p.status == "accepted")
    changes_req = sum(1 for p in proposals if p.status == "changes_requested")

    recent = db.query(Proposal).filter(Proposal.user_id == current_user.id).order_by(Proposal.updated_at.desc()).limit(5).all()

    return DashboardStats(
        total_proposals=total,
        draft_proposals=drafts,
        sent_proposals=sent,
        accepted_proposals=accepted,
        changes_requested_proposals=changes_req,
        total_clients=clients_count,
        recent_proposals=recent
    )
