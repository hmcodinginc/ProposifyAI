import json
import httpx
import re
from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.ai import (
    RequirementAnalysisResponse,
    FeatureItem,
    MissingInfoItem,
    ProposalGenerationResponse,
    GeneratedSection
)
from app.services.pricing_engine import PricingTimelineEngine

class AIService:
    @staticmethod
    async def _call_ollama(prompt: str, system_prompt: str = "") -> str:
        url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        payload = {
            "model": settings.AI_MODEL_NAME,
            "prompt": prompt,
            "system": system_prompt,
            "stream": False,
            "format": "json"
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            res = await client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                return data.get("response", "")
            else:
                raise Exception(f"Ollama HTTP error {res.status_code}: {res.text}")

    @classmethod
    async def analyze_requirements(cls, raw_requirements: str, client_name: str = None, client_industry: str = None) -> RequirementAnalysisResponse:
        # Try Ollama if enabled
        if not settings.USE_MOCK_AI_FALLBACK:
            try:
                system_prompt = "You are an expert AI Business Analyst. Analyze the client requirements and output JSON containing project_type, summary, extracted_features (title, description, complexity, estimated_hours), missing_information (category, question, reason), clarifying_questions, and suggested_hourly_rate."
                prompt = f"Requirements: {raw_requirements}\nClient Name: {client_name or 'N/A'}\nIndustry: {client_industry or 'N/A'}"
                raw_res = await cls._call_ollama(prompt, system_prompt)
                parsed = json.loads(raw_res)
                return RequirementAnalysisResponse(**parsed)
            except Exception as e:
                print(f"Ollama failed, falling back to smart AI analyzer: {e}")

        # Smart fallback requirement analyzer
        req_lower = raw_requirements.lower()

        # Project type detection
        project_type = "Full-Stack Web Application"
        if "mobile" in req_lower or "ios" in req_lower or "android" in req_lower or "flutter" in req_lower:
            project_type = "Cross-Platform Mobile Application"
        elif "e-commerce" in req_lower or "shop" in req_lower or "store" in req_lower:
            project_type = "E-Commerce Platform"
        elif "ai" in req_lower or "llm" in req_lower or "automation" in req_lower or "bot" in req_lower:
            project_type = "AI-Powered SaaS Solution"
        elif "crm" in req_lower or "erp" in req_lower or "portal" in req_lower:
            project_type = "Enterprise Management Portal"

        # Feature extraction rules
        features: List[FeatureItem] = [
            FeatureItem(
                title="User Authentication & RBAC",
                description="Secure login, registration, password recovery, and role-based access permissions.",
                complexity="medium",
                estimated_hours=24.0
            ),
            FeatureItem(
                title="Core Functional Dashboard & Analytics",
                description="Central interactive control panel displaying key metrics, activity logs, and real-time status updates.",
                complexity="medium",
                estimated_hours=32.0
            )
        ]

        if "pay" in req_lower or "billing" in req_lower or "stripe" in req_lower:
            features.append(FeatureItem(
                title="Payment Gateway Integration",
                description="Secure checkout workflow supporting credit cards, subscriptions, and invoicing via Stripe/PayPal.",
                complexity="high",
                estimated_hours=40.0
            ))

        if "ai" in req_lower or "proposal" in req_lower or "generator" in req_lower:
            features.append(FeatureItem(
                title="AI Content Processing Engine",
                description="Automated text extraction, requirement analysis, and AI-driven document generation.",
                complexity="high",
                estimated_hours=48.0
            ))

        if "pdf" in req_lower or "export" in req_lower:
            features.append(FeatureItem(
                title="Dynamic PDF Export & Branding",
                description="Custom HTML/PDF rendering engine with company logo, custom typography, and downloadable report exports.",
                complexity="medium",
                estimated_hours=20.0
            ))

        if "notification" in req_lower or "email" in req_lower:
            features.append(FeatureItem(
                title="Notification System & Webhooks",
                description="Email notifications, in-app updates, and event webhooks for activity tracking.",
                complexity="medium",
                estimated_hours=18.0
            ))

        # Additional default feature if total hours small
        if len(features) < 3:
            features.append(FeatureItem(
                title="API Development & Database Modeling",
                description="RESTful API endpoints with schema validation, PostgreSQL data persistent store, and migration scripts.",
                complexity="medium",
                estimated_hours=30.0
            ))

        missing_info = [
            MissingInfoItem(
                category="Infrastructure & Hosting",
                question="Do you have a preferred cloud host (e.g. AWS, GCP, Vercel, DigitalOcean) and domain setup?",
                reason="Affects deployment infrastructure costs and DevOps setup timeline."
            ),
            MissingInfoItem(
                category="Third-Party Services",
                question="Are there specific external APIs or legacy systems we need to integrate with?",
                reason="Required for API security design and data sync scheduling."
            ),
            MissingInfoItem(
                category="Branding & Design Assets",
                question="Will branding assets (logo, style guide, Figma designs) be provided by your team?",
                reason="Determines UI design effort and front-end theme creation."
            )
        ]

        questions = [m.question for m in missing_info]

        summary = f"The proposed solution is a {project_type} engineered to meet client goals: '{raw_requirements[:150]}...'. It will deliver a secure, scalable platform tailored for operational efficiency."

        return RequirementAnalysisResponse(
            project_type=project_type,
            summary=summary,
            extracted_features=features,
            missing_information=missing_info,
            clarifying_questions=questions,
            suggested_hourly_rate=85.0
        )

    @classmethod
    async def generate_proposal(
        cls,
        title: str,
        project_type: str,
        raw_requirements: str,
        features: List[FeatureItem],
        answers: Dict[str, str] = None,
        hourly_rate: float = 75.0
    ) -> ProposalGenerationResponse:
        
        # Calculate pricing & timeline
        pricing_data = PricingTimelineEngine.calculate_pricing_and_timeline(features, hourly_rate)
        total_price = pricing_data["total_price"]
        estimated_duration = pricing_data["estimated_duration_days"]
        pricing_items = pricing_data["pricing_items"]

        # Build comprehensive section contents
        answers_str = ""
        if answers:
            answers_str = "\n".join([f"- **{k}**: {v}" for k, v in answers.items() if v])

        executive_summary = f"""
We are pleased to present this comprehensive proposal for **{title}**.

### Executive Overview
{title} is designed as a high-performance **{project_type}** aimed at solving core operational challenges and delivering immediate value to your organization.

### Key Value Proposition
- **Turnkey Solution**: End-to-end development from design to cloud deployment.
- **Scalable Architecture**: Robust backend services with high availability and security best practices.
- **Enhanced User Experience**: Clean, intuitive interface designed for optimal engagement.
"""

        project_understanding = f"""
### Client Context & Business Need
Based on our analysis of your requirements:
> "{raw_requirements}"

{f"**Additional Clarifications Provided:**\n{answers_str}" if answers_str else ""}

### Strategic Goals
1. Deliver a robust {project_type} that automates workflows and streamlines operations.
2. Ensure enterprise-grade security, data privacy, and quick response times.
3. Provide an adaptable system structure ready for future expansion and feature enhancements.
"""

        proposed_solution = f"""
### Architectural Blueprint
Our proposed solution relies on a modern, decoupled architecture:
1. **Frontend Presentation Layer**: Built with React, TypeScript, and Tailwind CSS for lightning-fast UI responsiveness.
2. **Backend API Layer**: Powered by Python FastAPI with Pydantic type safety and SQLAlchemy ORM.
3. **Data Layer**: Relational database storage with transactional security and query optimization.
4. **AI & Automation Engine**: Integrated processing modules for requirement analysis and dynamic document generation.
"""

        feature_lines = "\n".join([f"#### {idx+1}. {f.title} ({f.complexity.capitalize()} Complexity - ~{f.estimated_hours} hrs)\n{f.description}\n" for idx, f in enumerate(features)])
        scope_of_work = f"""
### Detailed Scope of Work

The scope encompasses total development across the following module specifications:

{feature_lines}
"""

        deliverables = """
### Deliverables & Handover Package
1. **Production Software**: Fully deployed application accessible via custom domain with SSL certificate.
2. **Source Code & Repository**: Complete Git source code repository ownership.
3. **Database Schema & Migrations**: Fully structured relational database scripts.
4. **API Documentation**: Interactive Swagger/OpenAPI documentation for all backend endpoints.
5. **User & Admin Documentation**: Comprehensive guides covering system administration and user operations.
"""

        tech_stack = """
### Recommended Technology Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, TanStack Query, TipTap Editor
- **Backend API**: Python FastAPI, Pydantic, SQLAlchemy, Alembic
- **Database**: PostgreSQL / SQLite (with indexed querying)
- **AI Processing**: Ollama / Qwen3 / AI Provider Abstraction
- **DevOps & Hosting**: Docker, Nginx, GitHub Actions CI/CD
"""

        terms = """
### Terms and Conditions
1. **Payment Schedule**: Invoices will be issued according to the agreed milestone schedule.
2. **Intellectual Property**: Full ownership of custom code and IP transfers to the client upon final payment.
3. **Warranty & Support**: Includes 30 days of post-launch bug fixing and monitoring support.
4. **Change Management**: Out-of-scope feature requests will be documented and estimated as separate addendums.
"""

        next_steps = """
### Next Steps to Begin
1. **Review & Sign**: Review this proposal and click **Accept Proposal** via the share link.
2. **Project Kickoff**: We will schedule a 30-minute alignment meeting with key stakeholders.
3. **Milestone 1**: Deposit invoice will be generated to commence Phase 1 Architecture.
"""

        sections = [
            GeneratedSection(section_type="executive_summary", title="Executive Summary", content=executive_summary.strip(), order_index=0),
            GeneratedSection(section_type="project_understanding", title="Project Understanding", content=project_understanding.strip(), order_index=1),
            GeneratedSection(section_type="proposed_solution", title="Proposed Solution", content=proposed_solution.strip(), order_index=2),
            GeneratedSection(section_type="scope_of_work", title="Scope of Work", content=scope_of_work.strip(), order_index=3),
            GeneratedSection(section_type="deliverables", title="Deliverables", content=deliverables.strip(), order_index=4),
            GeneratedSection(section_type="tech_stack", title="Technology Stack", content=tech_stack.strip(), order_index=5),
            GeneratedSection(section_type="terms", title="Terms & Conditions", content=terms.strip(), order_index=6),
            GeneratedSection(section_type="next_steps", title="Next Steps", content=next_steps.strip(), order_index=7),
        ]

        return ProposalGenerationResponse(
            title=title,
            project_type=project_type,
            executive_summary=executive_summary,
            total_price=total_price,
            estimated_duration_days=estimated_duration,
            hourly_rate=hourly_rate,
            sections=sections,
            pricing_items=pricing_items
        )
