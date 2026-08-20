from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.models import Proposal, ProposalView, User, Client
from app.schemas.proposal import ProposalPublicResponse, PublicProposalActionRequest
from app.services.pdf_service import PDFGeneratorService

router = APIRouter(prefix="/public/proposals", tags=["Public Share Link"])

@router.get("/{token}", response_model=ProposalPublicResponse)
def get_public_proposal(
    token: str,
    request: Request,
    db: Session = Depends(get_db)
):
    proposal = db.query(Proposal).filter(Proposal.token == token).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found or invalid link")

    # Record proposal view
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    view_entry = ProposalView(
        proposal_id=proposal.id,
        client_ip=client_ip,
        user_agent=user_agent,
        viewed_at=datetime.utcnow(),
        action_taken="viewed"
    )
    db.add(view_entry)
    db.commit()

    owner = db.query(User).filter(User.id == proposal.user_id).first()
    client = db.query(Client).filter(Client.id == proposal.client_id).first() if proposal.client_id else None

    return ProposalPublicResponse(
        id=proposal.id,
        title=proposal.title,
        project_type=proposal.project_type,
        status=proposal.status,
        total_price=proposal.total_price,
        currency=proposal.currency,
        estimated_duration_days=proposal.estimated_duration_days,
        hourly_rate=proposal.hourly_rate,
        token=proposal.token,
        created_at=proposal.created_at,
        company_name=owner.company_name or owner.full_name if owner else "ProposifyAI User",
        company_logo=owner.company_logo if owner else None,
        client_name=client.name if client else "Valued Client",
        client_company=client.company if client else None,
        sections=proposal.sections,
        pricing_items=proposal.pricing_items
    )

@router.post("/{token}/action")
def record_client_action(
    token: str,
    action_req: PublicProposalActionRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    proposal = db.query(Proposal).filter(Proposal.token == token).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found or invalid link")

    if action_req.action == "accept":
        proposal.status = "accepted"
    elif action_req.action == "request_changes":
        proposal.status = "changes_requested"
    
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")

    view_entry = ProposalView(
        proposal_id=proposal.id,
        client_ip=client_ip,
        user_agent=user_agent,
        viewed_at=datetime.utcnow(),
        action_taken=action_req.action,
        feedback=action_req.feedback
    )
    db.add(view_entry)
    db.commit()

    return {"message": f"Proposal marked as {proposal.status}", "status": proposal.status}

@router.get("/{token}/pdf")
def get_public_pdf(
    token: str,
    db: Session = Depends(get_db)
):
    proposal = db.query(Proposal).filter(Proposal.token == token).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found or invalid link")

    owner = db.query(User).filter(User.id == proposal.user_id).first()
    client = db.query(Client).filter(Client.id == proposal.client_id).first() if proposal.client_id else None

    pdf_bytes = PDFGeneratorService.generate_proposal_pdf(proposal, owner, client)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=proposal_{proposal.token[:8]}.pdf"}
    )
