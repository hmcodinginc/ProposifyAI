import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class ProposalStatus(str, enum.Enum):
    DRAFT = "draft"
    SENT = "sent"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes_requested"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True)
    company_logo = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    clients = relationship("Client", back_populates="owner", cascade="all, delete-orphan")
    proposals = relationship("Proposal", back_populates="owner", cascade="all, delete-orphan")
    ai_jobs = relationship("AIJob", back_populates="owner", cascade="all, delete-orphan")

class Client(Base):
    __tablename__ = "clients"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="clients")
    proposals = relationship("Proposal", back_populates="client", cascade="all, delete-orphan")

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    client_id = Column(String, ForeignKey("clients.id"), nullable=True)
    title = Column(String, nullable=False)
    project_type = Column(String, nullable=True)
    status = Column(String, default=ProposalStatus.DRAFT.value)
    total_price = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    estimated_duration_days = Column(Integer, default=30)
    hourly_rate = Column(Float, default=75.0)
    token = Column(String, unique=True, index=True, default=generate_uuid)
    template_id = Column(String, ForeignKey("templates.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="proposals")
    client = relationship("Client", back_populates="proposals")
    sections = relationship("ProposalSection", back_populates="proposal", cascade="all, delete-orphan", order_by="ProposalSection.order_index")
    pricing_items = relationship("PricingItem", back_populates="proposal", cascade="all, delete-orphan", order_by="PricingItem.order_index")
    versions = relationship("ProposalVersion", back_populates="proposal", cascade="all, delete-orphan", order_by="ProposalVersion.version_number.desc()")
    views = relationship("ProposalView", back_populates="proposal", cascade="all, delete-orphan")

class ProposalSection(Base):
    __tablename__ = "proposal_sections"

    id = Column(String, primary_key=True, default=generate_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    section_type = Column(String, nullable=False)  # executive_summary, project_understanding, proposed_solution, scope_of_work, features, deliverables, tech_stack, terms, next_steps, custom
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    proposal = relationship("Proposal", back_populates="sections")

class PricingItem(Base):
    __tablename__ = "pricing_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    hours = Column(Float, default=0.0)
    rate = Column(Float, default=0.0)
    amount = Column(Float, default=0.0)
    milestone = Column(String, nullable=True)
    order_index = Column(Integer, default=0)

    proposal = relationship("Proposal", back_populates="pricing_items")

class ProposalVersion(Base):
    __tablename__ = "proposal_versions"

    id = Column(String, primary_key=True, default=generate_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    proposal = relationship("Proposal", back_populates="versions")

class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    structure = Column(JSON, nullable=True)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AIJob(Base):
    __tablename__ = "ai_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_type = Column(String, nullable=False)  # analyze, questions, generate
    status = Column(String, default="pending")  # pending, processing, completed, failed
    input_data = Column(JSON, nullable=True)
    result = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="ai_jobs")

class ProposalView(Base):
    __tablename__ = "proposal_views"

    id = Column(String, primary_key=True, default=generate_uuid)
    proposal_id = Column(String, ForeignKey("proposals.id"), nullable=False)
    client_ip = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    viewed_at = Column(DateTime, default=datetime.utcnow)
    action_taken = Column(String, default="viewed")  # viewed, accepted, changes_requested
    feedback = Column(Text, nullable=True)

    proposal = relationship("Proposal", back_populates="views")
