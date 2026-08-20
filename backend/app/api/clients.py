from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.models import User, Client, Proposal
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse
from app.schemas.proposal import ProposalResponse

router = APIRouter(prefix="/clients", tags=["Clients"])

@router.get("", response_model=List[ClientResponse])
def get_clients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Client).filter(Client.user_id == current_user.id).order_by(Client.created_at.desc()).all()

@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
def create_client(client_in: ClientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = Client(
        user_id=current_user.id,
        name=client_in.name,
        email=client_in.email,
        company=client_in.company,
        phone=client_in.phone,
        notes=client_in.notes
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.get("/{client_id}", response_model=ClientResponse)
def get_client(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id, Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=ClientResponse)
def update_client(client_id: str, client_in: ClientUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id, Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id, Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return None

@router.get("/{client_id}/proposals", response_model=List[ProposalResponse])
def get_client_proposals(client_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client = db.query(Client).filter(Client.id == client_id, Client.user_id == current_user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    proposals = db.query(Proposal).filter(Proposal.client_id == client_id).order_by(Proposal.created_at.desc()).all()
    return proposals
