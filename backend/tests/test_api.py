import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_register_and_login():
    # Register
    res = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test Agency",
        "company_name": "Acme Corp"
    })
    assert res.status_code == 200
    token_data = res.json()
    assert "access_token" in token_data
    token = token_data["access_token"]

    # Login
    res_login = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert res_login.status_code == 200
    assert "access_token" in res_login.json()

    # Get Me
    headers = {"Authorization": f"Bearer {token}"}
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "test@example.com"

def test_client_crud():
    # Register & get token
    res = client.post("/api/auth/register", json={"email": "client_tester@example.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Client
    c_res = client.post("/api/clients", json={
        "name": "John Doe",
        "email": "john@client.com",
        "company": "Client Inc",
        "phone": "+123456789"
    }, headers=headers)
    assert c_res.status_code == 201
    client_id = c_res.json()["id"]

    # Get Client List
    list_res = client.get("/api/clients", headers=headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    # Update Client
    up_res = client.put(f"/api/clients/{client_id}", json={"name": "John Updated"}, headers=headers)
    assert up_res.status_code == 200
    assert up_res.json()["name"] == "John Updated"

def test_ai_analyze_and_generate():
    res = client.post("/api/auth/register", json={"email": "ai_tester@example.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # AI Analyze
    ana_res = client.post("/api/ai/analyze", json={
        "raw_requirements": "I need an e-commerce website for my custom shoe business with payment gateway, catalog, user reviews, and admin dashboard.",
        "client_name": "Shoe Express"
    }, headers=headers)
    assert ana_res.status_code == 200
    ana_data = ana_res.json()
    assert "extracted_features" in ana_data
    assert len(ana_data["extracted_features"]) > 0

    # AI Generate Proposal
    gen_res = client.post("/api/ai/generate", json={
        "title": "E-Commerce Shoe Platform Proposal",
        "project_type": ana_data["project_type"],
        "raw_requirements": "I need an e-commerce website for custom shoes",
        "extracted_features": ana_data["extracted_features"],
        "hourly_rate": 80.0
    }, headers=headers)
    assert gen_res.status_code == 200
    gen_data = gen_res.json()
    assert len(gen_data["sections"]) > 0
    assert len(gen_data["pricing_items"]) > 0

def test_proposal_lifecycle_and_public_share():
    res = client.post("/api/auth/register", json={"email": "prop_tester@example.com", "password": "password123"})
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create Proposal
    create_res = client.post("/api/proposals", json={
        "title": "AI SaaS Development Proposal",
        "project_type": "AI Platform",
        "total_price": 5000.0,
        "sections": [
            {"section_type": "executive_summary", "title": "Executive Summary", "content": "Summary text", "order_index": 0}
        ],
        "pricing_items": [
            {"title": "Phase 1", "description": "MVP Development", "hours": 40, "rate": 100, "amount": 4000, "milestone": "M1", "order_index": 0}
        ]
    }, headers=headers)
    assert create_res.status_code == 201
    prop = create_res.json()
    prop_id = prop["id"]
    share_token = prop["token"]

    # Share proposal
    share_res = client.post(f"/api/proposals/{prop_id}/share", headers=headers)
    assert share_res.status_code == 200

    # Public client view
    pub_res = client.get(f"/api/public/proposals/{share_token}")
    assert pub_res.status_code == 200
    assert pub_res.json()["title"] == "AI SaaS Development Proposal"

    # Client Action (Accept)
    act_res = client.post(f"/api/public/proposals/{share_token}/action", json={
        "action": "accept",
        "feedback": "Looks great! Excited to work together."
    })
    assert act_res.status_code == 200
    assert act_res.json()["status"] == "accepted"
