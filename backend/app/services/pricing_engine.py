import math
from typing import List, Dict, Any
from app.schemas.ai import FeatureItem, GeneratedPricingItem

class PricingTimelineEngine:
    @staticmethod
    def calculate_pricing_and_timeline(
        features: List[FeatureItem],
        hourly_rate: float = 75.0,
        working_hours_per_day: float = 6.0
    ) -> Dict[str, Any]:
        total_dev_hours = sum(f.estimated_hours for f in features)
        if total_dev_hours <= 0:
            total_dev_hours = 40.0

        # Phase breakdowns
        discovery_hours = math.ceil(total_dev_hours * 0.10)
        design_hours = math.ceil(total_dev_hours * 0.15)
        dev_hours = math.ceil(total_dev_hours * 0.55)
        qa_hours = math.ceil(total_dev_hours * 0.12)
        deployment_hours = math.ceil(total_dev_hours * 0.08)

        total_project_hours = discovery_hours + design_hours + dev_hours + qa_hours + deployment_hours
        total_price = total_project_hours * hourly_rate
        total_working_days = math.ceil(total_project_hours / working_hours_per_day)

        milestones = [
            {
                "title": "Phase 1: Discovery & Architecture",
                "description": "Requirement breakdown, system architecture design, and database schema creation.",
                "hours": float(discovery_hours),
                "rate": hourly_rate,
                "amount": float(discovery_hours * hourly_rate),
                "milestone": "Milestone 1 (20% Upfront)",
                "order_index": 0
            },
            {
                "title": "Phase 2: UI/UX & Wireframing",
                "description": "Interactive visual mockups, component design system, and client design sign-off.",
                "hours": float(design_hours),
                "rate": hourly_rate,
                "amount": float(design_hours * hourly_rate),
                "milestone": "Milestone 2 (20%)",
                "order_index": 1
            },
            {
                "title": "Phase 3: Core Feature Development",
                "description": "Implementation of frontend interfaces, backend APIs, data pipelines, and third-party integrations.",
                "hours": float(dev_hours),
                "rate": hourly_rate,
                "amount": float(dev_hours * hourly_rate),
                "milestone": "Milestone 3 (40%)",
                "order_index": 2
            },
            {
                "title": "Phase 4: Quality Assurance & Testing",
                "description": "End-to-end integration testing, security audit, performance tuning, and bug remediation.",
                "hours": float(qa_hours),
                "rate": hourly_rate,
                "amount": float(qa_hours * hourly_rate),
                "milestone": "Milestone 4 (10%)",
                "order_index": 3
            },
            {
                "title": "Phase 5: Deployment & Handover",
                "description": "Production environment setup, domain routing, SSL setup, client training, and final documentation.",
                "hours": float(deployment_hours),
                "rate": hourly_rate,
                "amount": float(deployment_hours * hourly_rate),
                "milestone": "Milestone 5 (10% Final)",
                "order_index": 4
            }
        ]

        pricing_items = [GeneratedPricingItem(**m) for m in milestones]

        return {
            "total_hours": total_project_hours,
            "total_price": total_price,
            "working_days": total_working_days,
            "estimated_duration_days": math.ceil(total_working_days * 1.4), # including weekends/buffer
            "pricing_items": pricing_items,
            "phases": [
                {"name": "Discovery & Planning", "hours": discovery_hours, "percentage": 10},
                {"name": "UI/UX Design", "hours": design_hours, "percentage": 15},
                {"name": "Development & Integration", "hours": dev_hours, "percentage": 55},
                {"name": "QA & Security Testing", "hours": qa_hours, "percentage": 12},
                {"name": "Deployment & Launch", "hours": deployment_hours, "percentage": 8},
            ]
        }
