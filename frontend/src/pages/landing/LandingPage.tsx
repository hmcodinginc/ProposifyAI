import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Wand2, ArrowRight, CheckCircle2, ShieldCheck, Zap, Layers, DollarSign, FileText, Share2, Download, Star, ChevronRight, HelpCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demoReq, setDemoReq] = useState('Build a cross-platform mobile app for real estate listings with search, map view, user authentication, and appointment booking.');
  const [demoActive, setDemoActive] = useState(false);

  const handleTryDemo = () => {
    setDemoActive(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-['Inter',sans-serif] selection:bg-violet-500 selection:text-white relative overflow-hidden">
      {/* Animated Floating Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-violet-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-float" />

      {/* Top Header Navigation */}
      <nav className="h-20 border-b border-slate-800/80 px-6 lg:px-12 flex items-center justify-between relative z-20 max-w-7xl mx-auto backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-all duration-300 animate-float">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Proposify<span className="text-violet-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-6 lg:px-12 max-w-6xl mx-auto text-center relative z-10 space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-inner animate-pulse-glow">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Gen AI Business Proposal Generator</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto text-center">
          Turn Raw Requirements Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">Winning Proposals</span> In Seconds
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed text-center">
          Analyze client briefs, calculate project scope & pricing, detect missing requirements, and export branded PDF proposals automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? "/proposals/new" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95"
          >
            <Wand2 className="h-5 w-5" />
            <span>Generate Free Proposal</span>
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Try Interactive Demo</span>
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>ReportLab PDF Export</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Shareable Client Portal</span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO SHOWCASE SECTION */}
      <section id="demo" className="py-16 px-6 lg:px-12 max-w-5xl mx-auto relative z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl space-y-6 border border-violet-500/20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white text-center">Try the AI Requirement Analyzer Live</h2>
            <p className="text-xs text-slate-400 text-center">Paste sample client requirements below to preview instant feature extraction and timeline pricing calculations.</p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={4}
              value={demoReq}
              onChange={(e) => setDemoReq(e.target.value)}
              className="w-full p-4 bg-[#090d16] border border-slate-800 rounded-2xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-center transition-all"
            />
            <div className="flex justify-center">
              <button
                onClick={handleTryDemo}
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Wand2 className="h-4 w-4" />
                <span>Simulate AI Analysis</span>
              </button>
            </div>
          </div>

          {demoActive && (
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-6 text-center animate-fade-in">
              <div className="bg-violet-950/40 border border-violet-500/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 text-center">AI Classification Result</span>
                <h3 className="text-xl font-extrabold text-white mt-1 text-center">Cross-Platform Mobile Application</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-[#090d16] border border-slate-800 p-4 rounded-2xl text-center glass-card-hover">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Hours</span>
                  <p className="text-2xl font-extrabold text-white mt-1 text-center">142 hrs</p>
                </div>
                <div className="bg-[#090d16] border border-slate-800 p-4 rounded-2xl text-center glass-card-hover">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Hourly Rate</span>
                  <p className="text-2xl font-extrabold text-violet-400 mt-1 text-center">$85 / hr</p>
                </div>
                <div className="bg-[#090d16] border border-slate-800 p-4 rounded-2xl text-center glass-card-hover">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Calculated Total</span>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1 text-center">$12,070 USD</p>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={() => navigate(user ? '/proposals/new' : '/register')}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <span>Generate Full 8-Page Proposal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-20 px-6 lg:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white text-center">Everything You Need To Close Deals Faster</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto text-center">Engineered for agencies, freelancers, and software consultants who want to convert briefs into signed contracts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Wand2,
              title: 'AI Requirement Analyzer',
              desc: 'Automatically parses client emails, requirements documents, and notes to extract features, complexity, and estimated development hours.',
            },
            {
              icon: DollarSign,
              title: 'Pricing & Timeline Engine',
              desc: 'Calculates milestone distribution, working days, total budget, and phase breakdowns (Discovery, Design, Dev, QA, Launch).',
            },
            {
              icon: HelpCircle,
              title: 'Missing Info Detection',
              desc: 'Identifies underspecified client requirements and generates targeted clarifying questions before proposal finalization.',
            },
            {
              icon: Layers,
              title: 'Rich Proposal Editor',
              desc: 'Drag-and-drop section reordering, rich markdown editing, milestone pricing tables, and version revision snapshot history.',
            },
            {
              icon: Download,
              title: 'ReportLab PDF Export',
              desc: 'Generates print-ready PDF proposals with your agency logo, typography, table styling, and custom terms.',
            },
            {
              icon: Share2,
              title: 'Shareable Client Portal',
              desc: 'Unique public link where clients view styled proposals, download PDFs, and click to Accept or Request Changes.',
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card glass-card-hover p-6 rounded-3xl text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto animate-float">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white text-center">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed text-center">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section className="py-20 bg-slate-950/60 border-t border-b border-slate-800/80 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white text-center">3 Steps To Your Perfect Proposal</h2>
            <p className="text-xs text-slate-400 text-center">From raw notes to signed proposal in under two minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-card glass-card-hover p-8 rounded-3xl text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
                1
              </div>
              <h3 className="text-lg font-bold text-white text-center">Paste Client Brief</h3>
              <p className="text-xs text-slate-400 text-center">Input raw client requirements from emails, sales calls, or briefs.</p>
            </div>

            <div className="glass-card glass-card-hover p-8 rounded-3xl text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
                2
              </div>
              <h3 className="text-lg font-bold text-white text-center">AI Scope & Pricing</h3>
              <p className="text-xs text-slate-400 text-center">Qwen3 AI generates features, timeline, milestone pricing & section contents.</p>
            </div>

            <div className="glass-card glass-card-hover p-8 rounded-3xl text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-violet-500/25">
                3
              </div>
              <h3 className="text-lg font-bold text-white text-center">Export & Share</h3>
              <p className="text-xs text-slate-400 text-center">Download PDF or share client link for instant online acceptance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white text-center">Simple, Transparent Pricing</h2>
          <p className="text-sm text-slate-400 text-center">Start for free and scale as your client pipeline grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-6 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white text-center">Starter</h3>
              <p className="text-xs text-slate-400 text-center">For freelancers getting started</p>
              <div className="pt-4 text-3xl font-extrabold text-white text-center">$0 <span className="text-xs text-slate-400">/ mo</span></div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 text-center">
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> 5 AI Proposals / month</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Basic PDF Export</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Client Share Links</li>
            </ul>

            <Link to="/register" className="w-full py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl block text-center transition-colors">
              Get Started Free
            </Link>
          </div>

          <div className="bg-gradient-to-b from-violet-950/60 to-[#0b0f19] border-2 border-violet-500 p-8 rounded-3xl space-y-6 text-center relative shadow-2xl transform scale-105">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-md">
              Most Popular
            </span>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white text-center">Pro Agency</h3>
              <p className="text-xs text-slate-400 text-center">For growing agencies & teams</p>
              <div className="pt-4 text-3xl font-extrabold text-white text-center">$49 <span className="text-xs text-slate-400">/ mo</span></div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 text-center">
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Unlimited AI Proposals</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom Branding & Logo</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Version History & Audit Logs</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Priority Support</li>
            </ul>

            <Link to="/register" className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl block text-center shadow-lg shadow-violet-500/25 transition-all">
              Start Free Trial
            </Link>
          </div>

          <div className="glass-card glass-card-hover p-8 rounded-3xl space-y-6 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white text-center">Enterprise</h3>
              <p className="text-xs text-slate-400 text-center">For large software houses</p>
              <div className="pt-4 text-3xl font-extrabold text-white text-center">$99 <span className="text-xs text-slate-400">/ mo</span></div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 text-center">
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Dedicated Ollama / Custom LLM</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Multi-Seat Team Access</li>
              <li className="flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Custom Domain White-Labeling</li>
            </ul>

            <Link to="/register" className="w-full py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl block text-center transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="py-16 border-t border-slate-800/80 text-center space-y-6 bg-slate-950/40">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-white text-center">Ready To Win 3x More Client Proposals?</h2>
          <p className="text-xs text-slate-400 text-center">Join hundreds of agencies generating proposals effortlessly with ProposifyAI.</p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-500/30 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 active:scale-95"
            >
              <span>Get Started Free Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="pt-8 text-xs text-slate-500 border-t border-slate-900 max-w-7xl mx-auto px-6">
          © {new Date().getFullYear()} ProposifyAI. All rights reserved. Built for modern software agencies and consultants.
        </div>
      </footer>
    </div>
  );
};
