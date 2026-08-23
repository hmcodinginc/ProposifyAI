import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Wand2, Sparkles, CheckCircle2, Clock, DollarSign, ArrowRight, RefreshCw, Sliders, Layers, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SamplePreset {
  title: string;
  category: string;
  text: string;
  hours: number;
  features: string[];
  missingInfo: string[];
}

const PRESETS: SamplePreset[] = [
  {
    title: 'Mobile Real Estate App',
    category: 'Cross-Platform Mobile',
    text: 'Build a cross-platform mobile app for real estate listings with search, interactive map view, user authentication, agent messaging, appointment booking, and push notifications.',
    hours: 140,
    features: [
      'Interactive Property Map & Filter (Google Maps SDK)',
      'Agent & Buyer Real-Time In-App Messaging',
      'Appointment Scheduling & Calendar Integration',
      'User Auth (OAuth + Email/Password + Push Notifications)'
    ],
    missingInfo: [
      'Target MLS/IDX API provider not specified',
      'Mortgage calculator requirements missing',
      'Payment gateway provider for agent subscriptions undefined'
    ]
  },
  {
    title: 'E-Commerce Platform',
    category: 'Full-Stack Web App',
    text: 'Develop a modern e-commerce platform with product catalog, cart, Stripe payment gateway, inventory management dashboard, order tracking, and discount coupon codes.',
    hours: 180,
    features: [
      'Stripe Payment Gateway & Multi-Currency Checkout',
      'Admin Inventory & Order Management Dashboard',
      'Product Reviews & Rating System',
      'Discount Coupon & Automated Email Receipts'
    ],
    missingInfo: [
      'Shipping carrier API integration preference not specified',
      'Tax calculation provider (TaxJar/Avalara) missing',
      'Product variant count & bulk import requirements unclarified'
    ]
  },
  {
    title: 'AI Enterprise SaaS',
    category: 'AI / LLM Integration',
    text: 'Build an AI document summarization and Q&A workspace for law firms. Features include PDF drag-and-drop, vector embedding search, multi-tenant team accounts, and billing.',
    hours: 220,
    features: [
      'Vector Search & RAG Pipeline (Pinecone + OpenAI)',
      'Multi-Tenant Organization & Role Permissions',
      'Drag-and-Drop PDF Parsing Engine',
      'Usage-Based Billing & API Metering'
    ],
    missingInfo: [
      'SOC2 compliance / HIPAA data residency requirements missing',
      'On-premise LLM deployment vs Cloud API unclarified',
      'Maximum PDF file size limit not specified'
    ]
  }
];

interface LiveDemoSectionProps {
  user: any;
}

export const LiveDemoSection: React.FC<LiveDemoSectionProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [reqText, setReqText] = useState<string>(PRESETS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [hourlyRate, setHourlyRate] = useState<number>(85);
  const [enabledFeatures, setEnabledFeatures] = useState<boolean[]>([true, true, true, true]);

  const currentPreset = PRESETS[selectedPreset];

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setReqText(PRESETS[idx].text);
    setIsAnalyzed(false);
    setAnalysisStep(0);
    setEnabledFeatures([true, true, true, true]);
  };

  const handleSimulateAnalysis = () => {
    setIsAnalyzing(true);
    setIsAnalyzed(false);
    setAnalysisStep(1);

    setTimeout(() => setAnalysisStep(2), 700);
    setTimeout(() => setAnalysisStep(3), 1400);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsAnalyzed(true);
      setAnalysisStep(4);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 2100);
  };

  const toggleFeature = (idx: number) => {
    const updated = [...enabledFeatures];
    updated[idx] = !updated[idx];
    setEnabledFeatures(updated);
  };

  const activeFeaturesCount = enabledFeatures.filter(Boolean).length;
  const featureFactor = activeFeaturesCount / 4;
  const computedHours = Math.round(currentPreset.hours * (0.5 + 0.5 * featureFactor));
  const computedTotal = computedHours * hourlyRate;

  return (
    <section id="demo" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto relative z-10">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-semibold">
          <Wand2 className="h-3.5 w-3.5 text-[#4a382a]" />
          <span>Interactive AI Analyzer Simulator</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
          Experience AI Requirement Analysis Live
        </h2>
        <p className="text-sm text-[#6e5d53] max-w-2xl mx-auto">
          Select a sample client brief below or enter custom text to test automated scope parsing, risk detection, and milestone pricing estimation.
        </p>
      </div>

      <div className="warm-glass-card rounded-3xl p-6 sm:p-8 shadow-md border border-[#e6dbc9] space-y-6">
        {/* Preset Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-[#6e5d53] font-medium mr-2">Sample Briefs:</span>
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedPreset === idx
                  ? 'bg-[#4a382a] text-white shadow-sm'
                  : 'bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3]'
              }`}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Requirements Input Area */}
        <div className="space-y-3">
          <textarea
            rows={4}
            value={reqText}
            onChange={(e) => {
              setReqText(e.target.value);
              setIsAnalyzed(false);
            }}
            placeholder="Paste your raw client brief, notes, or email thread here..."
            className="w-full p-4 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 font-sans leading-relaxed transition-all shadow-inner"
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#6e5d53] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#b87d4b]" />
              <span>Powered by Qwen3 AI Proposal Engine</span>
            </div>

            <button
              onClick={handleSimulateAnalysis}
              disabled={isAnalyzing || !reqText.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Brief...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>Simulate AI Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-[#f5efe6] rounded-2xl border border-[#e3d7c5] space-y-4"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#4a382a]">
              <span>AI Processing Steps</span>
              <span>Step {analysisStep} of 3</span>
            </div>
            <div className="w-full bg-[#eee6da] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#4a382a] h-full transition-all duration-500"
                style={{ width: `${(analysisStep / 3) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#6e5d53]">
              <div className={`flex items-center gap-2 ${analysisStep >= 1 ? 'text-[#4a382a] font-semibold' : ''}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${analysisStep >= 1 ? 'text-[#4a382a]' : 'text-slate-400'}`} />
                <span>1. Parsing Brief Specs</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStep >= 2 ? 'text-[#4a382a] font-semibold' : ''}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${analysisStep >= 2 ? 'text-[#4a382a]' : 'text-slate-400'}`} />
                <span>2. Detecting Scope Gaps</span>
              </div>
              <div className={`flex items-center gap-2 ${analysisStep >= 3 ? 'text-[#4a382a] font-semibold' : ''}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${analysisStep >= 3 ? 'text-[#4a382a]' : 'text-slate-400'}`} />
                <span>3. Calculating Pricing</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analysis Results */}
        <AnimatePresence>
          {isAnalyzed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="pt-6 border-t border-[#e6dbc9] space-y-6"
            >
              {/* Banner */}
              <div className="bg-[#eee6da]/60 border border-[#e3d7c5] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#945f32]">Extracted Project Category</span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#2c221e]">{currentPreset.category}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#e2f0d9] text-[#2e6b22] border border-[#c3e0b5] text-xs font-bold rounded-lg">
                    Complexity: Moderate
                  </span>
                  <span className="px-3 py-1 bg-[#f0e6d9] text-[#7a572a] border border-[#e0cbaf] text-xs font-bold rounded-lg">
                    Risk Score: Low
                  </span>
                </div>
              </div>

              {/* Dynamic Interactive Pricing Slider */}
              <div className="bg-[#fcfbf8] border border-[#e6dbc9] rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#2c221e] flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-[#945f32]" />
                      <span>Interactive Pricing Calculator</span>
                    </h4>
                    <p className="text-xs text-[#6e5d53]">Adjust hourly rate to re-estimate project quote live.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-[#eee6da] px-4 py-2 rounded-xl border border-[#e2d6c3]">
                    <span className="text-xs text-[#6e5d53] font-medium">Hourly Rate:</span>
                    <span className="text-base font-extrabold text-[#4a382a]">${hourlyRate} / hr</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="45"
                  max="175"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-[#eee6da] rounded-lg appearance-none cursor-pointer accent-[#4a382a]"
                />

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#f5efe6] border border-[#e6dbc9] p-4 rounded-xl text-center warm-card-hover">
                    <span className="text-xs text-[#6e5d53] uppercase font-semibold flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#945f32]" /> Estimated Time
                    </span>
                    <p className="text-2xl font-extrabold text-[#2c221e] mt-1">{computedHours} hrs</p>
                    <span className="text-[10px] text-[#8c7b6f]">~{Math.ceil(computedHours / 35)} weeks timeline</span>
                  </div>

                  <div className="bg-[#f5efe6] border border-[#e6dbc9] p-4 rounded-xl text-center warm-card-hover">
                    <span className="text-xs text-[#6e5d53] uppercase font-semibold flex items-center justify-center gap-1">
                      <Sliders className="h-3.5 w-3.5 text-[#945f32]" /> Selected Rate
                    </span>
                    <p className="text-2xl font-extrabold text-[#4a382a] mt-1">${hourlyRate} / hr</p>
                    <span className="text-[10px] text-[#8c7b6f]">Standard agency rate</span>
                  </div>

                  <div className="bg-[#eef5eb] border border-[#cbe3c5] p-4 rounded-xl text-center warm-card-hover">
                    <span className="text-xs text-[#2e6b22] uppercase font-semibold flex items-center justify-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-[#2e6b22]" /> Total Project Quote
                    </span>
                    <p className="text-2xl font-extrabold text-[#2e6b22] mt-1">${computedTotal.toLocaleString()} USD</p>
                    <span className="text-[10px] text-[#2e6b22]/80 font-medium">3 Milestones</span>
                  </div>
                </div>
              </div>

              {/* Extracted Features List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c221e] flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#945f32]" />
                  <span>Extracted Deliverables & Scope Items</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPreset.features.map((feat, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleFeature(idx)}
                      className={`p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-3 ${
                        enabledFeatures[idx]
                          ? 'bg-[#f5efe6] border-[#e6dbc9] text-[#2c221e]'
                          : 'bg-[#eee6da]/50 border-slate-200 text-slate-400 line-through'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={enabledFeatures[idx]}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#4a382a] h-4 w-4 rounded cursor-pointer"
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Gap Detection */}
              <div className="bg-[#fcf5eb] border border-[#f0dfcc] p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#a86523] text-xs font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  <span>AI Scope Gap Detection (3 Underspecified Points Identified)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#7c5228] pl-6 list-disc">
                  {currentPreset.missingInfo.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-xs text-[#6e5d53]">Ready to convert this into a printable PDF proposal?</span>
                <button
                  onClick={() => navigate(user ? '/proposals/new' : '/register')}
                  className="w-full sm:w-auto px-7 py-3 bg-[#4a382a] hover:bg-[#382a1e] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>Generate Full Proposal Document</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
