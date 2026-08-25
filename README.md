# ProposifyAI - AI-Powered Business Proposal Generator 🚀

**ProposifyAI** is an AI-powered web application designed to convert raw, unstructured client requirements into professional, print-ready business proposals. The system analyzes client briefs, detects missing technical requirements and scope gaps, estimates project hours and milestone pricing, and produces customizable agency proposals that can be exported as branded PDFs or shared via interactive web links.

---

## 🌟 Key Features

- **🤖 AI Requirement Analyzer**: Parses client emails, briefs, and notes to automatically extract project category, core deliverables, and complexity metrics.
- **🛡️ Scope Risk & Missing Info Detector**: Identifies missing technical specs (e.g. authentication model, payment gateways, SLA, compliance) before proposal finalization to prevent unpaid scope creep.
- **💰 Dynamic Pricing & Timeline Engine**: Calculates development hour estimates across phases (Discovery, Design, Development, QA, Deployment) with interactive hourly rate sliders and milestone payment tables.
- **📄 Agency Proposal Templates**: Includes agency-tested template presets (*Modern Tech & SaaS*, *Executive Sleek*, *Agency Creative*) customized with your logo, brand colors, and legal terms.
- **📥 ReportLab PDF Export**: Generates clean, high-resolution, print-ready PDF proposals for offline client delivery.
- **🔗 Shareable Client Portal**: Generates unique public links (`/p/:token`) where clients can view styled web proposals, download PDFs, and click to accept or request revisions.
- **📊 Real-Time Proposal Tracking**: Track proposal status (*Draft*, *Sent*, *Viewed*, *Accepted*, *Revision Requested*) and audit revision history.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism Mesh Gradients
- **Animations**: Framer Motion + Canvas Confetti
- **Icons**: Lucide React

### Backend
- **Framework**: Python 3.10+ & FastAPI
- **Database**: SQLite / PostgreSQL (SQLAlchemy ORM)
- **PDF Generation**: ReportLab engine
- **Authentication**: JWT & Passlib (Bcrypt)
- **AI Engine**: Qwen3 / OpenAI / Custom LLM Endpoint

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: 3.10 or higher
- **npm**: v9.0.0 or higher

---

### 1. 🐍 Backend Setup (FastAPI)

1. **Navigate to the Backend Directory**:
   ```bash
   cd ProposifyAI/backend
   ```

2. **Create & Activate Virtual Environment**:
   - **On Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **On macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Required Python Packages**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**:
   Create a `.env` file in `ProposifyAI/backend/` (or set environment variables):
   ```env
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   DATABASE_URL=sqlite:///./proposifyai.db
   OPENAI_API_KEY=your_optional_llm_api_key
   ```

5. **Start the Backend Server**:
   ```bash
   python main.py
   ```
   *Alternatively using Uvicorn directly:*
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   > 🌐 **Backend API**: `http://localhost:8000`  
   > 📑 **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. ⚛️ Frontend Setup (React + Vite + TypeScript)

1. **Navigate to the Frontend Directory**:
   ```bash
   cd ProposifyAI/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in `ProposifyAI/frontend/` if needed:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   > 🌐 **Frontend Application**: `http://localhost:5173`

5. **Build for Production**:
   ```bash
   npm run build
   ```
   To test the production build locally:
   ```bash
   npm run preview
   ```

---
