from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Client, Proposal, ProposalSection, PricingItem, ProposalVersion
from app.schemas.proposal import (
    ProposalCreate,
    ProposalUpdate,
    ProposalResponse,
    ShareProposalRequest,
    ShareProposalResponse,
    ProposalVersionResponse
)
from app.services.pdf_service import PDFGeneratorService

router = APIRouter(prefix="/proposals", tags=["Proposals"])

@router.get("", response_model=List[ProposalResponse])
def get_proposals(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Proposal).filter(Proposal.user_id == current_user.id)
    if status_filter:
        query = query.filter(Proposal.status == status_filter)
    return query.order_by(Proposal.created_at.desc()).all()

@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(
    prop_in: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = Proposal(
        user_id=current_user.id,
        client_id=prop_in.client_id,
        title=prop_in.title,
        project_type=prop_in.project_type,
        status=prop_in.status or "draft",
        total_price=prop_in.total_price or 0.0,
        currency=prop_in.currency or "USD",
        estimated_duration_days=prop_in.estimated_duration_days or 30,
        hourly_rate=prop_in.hourly_rate or 75.0
    )
    db.add(proposal)
    db.commit()
    db.refresh(proposal)

    # Add sections if provided
    if prop_in.sections:
        for idx, sec in enumerate(prop_in.sections):
            section_obj = ProposalSection(
                proposal_id=proposal.id,
                section_type=sec.section_type,
                title=sec.title,
                content=sec.content,
                order_index=sec.order_index if sec.order_index is not None else idx
            )
            db.add(section_obj)

    # Add pricing items if provided
    if prop_in.pricing_items:
        for idx, p_item in enumerate(prop_in.pricing_items):
            item_obj = PricingItem(
                proposal_id=proposal.id,
                title=p_item.title,
                description=p_item.description,
                hours=p_item.hours,
                rate=p_item.rate,
                amount=p_item.amount,
                milestone=p_item.milestone,
                order_index=p_item.order_index if p_item.order_index is not None else idx
            )
            db.add(item_obj)

    db.commit()
    db.refresh(proposal)

    # Create Initial Version
    _create_version_snapshot(db, proposal, version_num=1)

    return proposal

@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal

@router.put("/{proposal_id}", response_model=ProposalResponse)
def update_proposal(
    proposal_id: str,
    prop_in: ProposalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    # Update basic fields
    if prop_in.title is not None:
        proposal.title = prop_in.title
    if prop_in.client_id is not None:
        proposal.client_id = prop_in.client_id
    if prop_in.project_type is not None:
        proposal.project_type = prop_in.project_type
    if prop_in.status is not None:
        proposal.status = prop_in.status
    if prop_in.total_price is not None:
        proposal.total_price = prop_in.total_price
    if prop_in.currency is not None:
        proposal.currency = prop_in.currency
    if prop_in.estimated_duration_days is not None:
        proposal.estimated_duration_days = prop_in.estimated_duration_days
    if prop_in.hourly_rate is not None:
        proposal.hourly_rate = prop_in.hourly_rate

    # Update sections if specified
    if prop_in.sections is not None:
        db.query(ProposalSection).filter(ProposalSection.proposal_id == proposal.id).delete()
        for idx, sec in enumerate(prop_in.sections):
            section_obj = ProposalSection(
                proposal_id=proposal.id,
                section_type=sec.section_type,
                title=sec.title,
                content=sec.content,
                order_index=sec.order_index if sec.order_index is not None else idx
            )
            db.add(section_obj)

    # Update pricing items if specified
    if prop_in.pricing_items is not None:
        db.query(PricingItem).filter(PricingItem.proposal_id == proposal.id).delete()
        for idx, p_item in enumerate(prop_in.pricing_items):
            item_obj = PricingItem(
                proposal_id=proposal.id,
                title=p_item.title,
                description=p_item.description,
                hours=p_item.hours,
                rate=p_item.rate,
                amount=p_item.amount,
                milestone=p_item.milestone,
                order_index=p_item.order_index if p_item.order_index is not None else idx
            )
            db.add(item_obj)

    db.commit()
    db.refresh(proposal)

    # Create new Version snapshot
    latest_version = db.query(ProposalVersion).filter(ProposalVersion.proposal_id == proposal.id).order_by(ProposalVersion.version_number.desc()).first()
    next_ver = (latest_version.version_number + 1) if latest_version else 1
    _create_version_snapshot(db, proposal, version_num=next_ver)

    return proposal

@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    db.delete(proposal)
    db.commit()
    return None

@router.post("/{proposal_id}/pdf")
def generate_pdf(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    client = db.query(Client).filter(Client.id == proposal.client_id).first() if proposal.client_id else None
    pdf_bytes = PDFGeneratorService.generate_proposal_pdf(proposal, current_user, client)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=proposal_{proposal.id[:8]}.pdf"}
    )

@router.post("/{proposal_id}/share", response_model=ShareProposalResponse)
def share_proposal(
    proposal_id: str,
    share_req: ShareProposalRequest = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    if proposal.status == "draft":
        proposal.status = "sent"
        db.commit()

    share_url = f"/p/{proposal.token}"
    return ShareProposalResponse(share_url=share_url, token=proposal.token)

@router.get("/{proposal_id}/versions", response_model=List[ProposalVersionResponse])
def get_versions(
    proposal_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id, Proposal.user_id == current_user.id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal.versions

def _create_version_snapshot(db: Session, proposal: Proposal, version_num: int):
    snapshot_data = {
        "title": proposal.title,
        "project_type": proposal.project_type,
        "status": proposal.status,
        "total_price": proposal.total_price,
        "currency": proposal.currency,
        "estimated_duration_days": proposal.estimated_duration_days,
        "sections": [
            {
                "section_type": s.section_type,
                "title": s.title,
                "content": s.content,
                "order_index": s.order_index
            } for s in proposal.sections
        ],
        "pricing_items": [
            {
                "title": item.title,
                "description": item.description,
                "hours": item.hours,
                "rate": item.rate,
                "amount": item.amount,
                "milestone": item.milestone,
                "order_index": item.order_index
            } for item in proposal.pricing_items
        ]
    }
    ver = ProposalVersion(
        proposal_id=proposal.id,
        version_number=version_num,
        data=snapshot_data
    )
    db.add(ver)
    db.commit()
