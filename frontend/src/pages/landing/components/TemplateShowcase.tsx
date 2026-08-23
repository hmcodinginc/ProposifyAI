import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Check, Download, ExternalLink, Sparkles, FileText, CheckCircle2, Shield, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TemplateOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  accentColor: string;
  bgGradient: string;
  previewTitle: string;
  sections: string[];
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Tech & SaaS',
    badge: 'Popular',
    description: 'Designed for software development agencies, SaaS vendors, and digital product studios.',
    accentColor: 'text-violet-400',
    bgGradient: 'from-violet-900/40 to-slate-900',
    previewTitle: 'Mobile App & Cloud Infrastructure Proposal',
    sections: [
      '1. Executive Summary & Goals',
      '2. Architecture & Tech Stack (React Native + AWS)',
      '3. Deliverables & Milestone Breakdown',
      '4. Fixed Investment & Billing Terms',
      '5. Service Level Agreement (SLA)'
    ]
  },
  {
    id: 'executive',
    name: 'Executive Sleek',
    badge: 'Enterprise',
    description: 'High-contrast corporate structure built for enterprise deals and C-level decision makers.',
    accentColor: 'text-indigo-400',
    bgGradient: 'from-indigo-900/40 to-slate-900',
    previewTitle: 'Enterprise Digital Transformation Initiative',
    sections: [
      '1. Strategic Business Objectives',
      '2. Scope of Work & Governance',
      '3. Resource Allocation & Timeline Matrix',
      '4. Commercial Terms & Phase Pricing',
      '5. Security, Compliance & Sign-Off'
    ]
  },
  {
    id: 'creative',
    name: 'Agency Creative',
    badge: 'Design & UX',
    description: 'Vibrant visual layout ideal for UI/UX redesigns, branding, and marketing strategy.',
    accentColor: 'text-purple-400',
    bgGradient: 'from-purple-900/40 to-slate-900',
    previewTitle: 'Brand Identity & Web Application Redesign',
    sections: [
      '1. Project Vision & Brand Alignment',
      '2. UX Discovery & Design System',
      '3. Interactive Prototype Deliverables',
      '4. Design Sprints & Payment Milestones',
      '5. Ownership & Intellectual Property'
    ]
  }
];

export const TemplateShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('modern');

  const currentTemplate = TEMPLATES.find((t) => t.id === activeTab) || TEMPLATES[0];

  return (
    <section className="py-20 px-6 lg:px-12 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <Layout className="h-3.5 w-3.5" />
          <span>Agency Proposal Templates</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Client-Ready Templates Built to Convert
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Switch between agency-tested layout presets, automatically customized with your branding, colors, and terms.
        </p>
      </div>

      {/* Template Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setActiveTab(tmpl.id)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
              activeTab === tmpl.id
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 scale-105'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{tmpl.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] uppercase tracking-wide">
              {tmpl.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Live Document Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="glass-card rounded-3xl p-6 sm:p-10 border border-violet-500/20 shadow-2xl relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${currentTemplate.accentColor}`}>
                {currentTemplate.name} Preset
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {currentTemplate.previewTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{currentTemplate.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" /> PDF Ready
              </span>
              <Link
                to="/register"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-violet-500/20 flex items-center gap-1.5"
              >
                <span>Use Template</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Document Content Mock */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table of Contents & Structure */}
            <div className="lg:col-span-2 bg-[#080c14] border border-slate-800/90 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Document Outline</span>
                <span className="text-[10px] text-slate-500 font-mono">8 Pages • ReportLab Output</span>
              </div>

              <div className="space-y-3">
                {currentTemplate.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs text-slate-200 hover:border-violet-500/30 transition-all"
                  >
                    <span className="font-medium">{sec}</span>
                    <Check className="h-4 w-4 text-emerald-400" />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Includes Agency Watermark, Terms & Signature Block</span>
                <span className="text-violet-400 font-semibold cursor-pointer flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> Live PDF Preview
                </span>
              </div>
            </div>

            {/* Template Features sidebar */}
            <div className="bg-gradient-to-b from-slate-900 to-[#080c14] border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Template Perks</h4>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Auto-calculated milestone payment table</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Scope risk assessment & clarifying notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Clickable client approval & e-signature block</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Shareable password-protected link</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl block text-center border border-slate-700 transition-colors shadow-inner"
              >
                Customize with Your Logo
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
