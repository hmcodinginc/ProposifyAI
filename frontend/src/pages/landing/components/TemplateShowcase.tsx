import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Check, ExternalLink, FileText, CheckCircle2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TemplateOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  accentColor: string;
  previewTitle: string;
  sections: string[];
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Tech & SaaS',
    badge: 'Popular',
    description: 'Designed for software development agencies, SaaS vendors, and digital product studios.',
    accentColor: 'text-[#945f32]',
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
    accentColor: 'text-[#4a382a]',
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
    accentColor: 'text-[#ba8350]',
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-semibold">
          <Layout className="h-3.5 w-3.5 text-[#4a382a]" />
          <span>Agency Proposal Templates</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
          Client-Ready Templates Built to Convert
        </h2>
        <p className="text-sm text-[#6e5d53] max-w-xl mx-auto">
          Switch between agency-tested layout presets, automatically customized with your branding, colors, and terms.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => setActiveTab(tmpl.id)}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2.5 ${
              activeTab === tmpl.id
                ? 'bg-[#4a382a] text-white shadow-md scale-105'
                : 'bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3]'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>{tmpl.name}</span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] uppercase tracking-wide">
              {tmpl.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Document Showcase */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="warm-glass-card rounded-3xl p-6 sm:p-10 border border-[#e6dbc9] shadow-lg relative overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e6dbc9] pb-6">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${currentTemplate.accentColor}`}>
                {currentTemplate.name} Preset
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#2c221e] mt-1">
                {currentTemplate.previewTitle}
              </h3>
              <p className="text-xs text-[#6e5d53] mt-1">{currentTemplate.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2e6b22] bg-[#eef5eb] px-3 py-1.5 rounded-xl border border-[#cbe3c5]">
                <CheckCircle2 className="h-3.5 w-3.5" /> PDF Ready
              </span>
              <Link
                to="/register"
                className="px-4 py-2 bg-[#4a382a] hover:bg-[#382a1e] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>Use Template</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#fcfbf8] border border-[#e6dbc9] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#e6dbc9] pb-3">
                <span className="text-xs font-bold text-[#2c221e] uppercase tracking-wider">Document Outline</span>
                <span className="text-[10px] text-[#8c7b6f] font-mono">8 Pages • ReportLab Output</span>
              </div>

              <div className="space-y-3">
                {currentTemplate.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#f5efe6] rounded-xl border border-[#e6dbc9] flex items-center justify-between text-xs text-[#2c221e] hover:border-[#ba8350]/50 transition-all"
                  >
                    <span className="font-medium">{sec}</span>
                    <Check className="h-4 w-4 text-[#2e6b22]" />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#6e5d53]">
                <span>Includes Agency Watermark, Terms & Signature Block</span>
                <span className="text-[#945f32] font-semibold cursor-pointer flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> Live PDF Preview
                </span>
              </div>
            </div>

            <div className="bg-[#f5efe6] border border-[#e6dbc9] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2c221e]">Template Perks</h4>
                <ul className="space-y-2.5 text-xs text-[#6e5d53]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                    <span>Auto-calculated milestone payment table</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                    <span>Scope risk assessment & clarifying notes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                    <span>Clickable client approval & e-signature block</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                    <span>Shareable password-protected link</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="w-full py-3 bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] font-bold text-xs rounded-xl block text-center border border-[#e2d6c3] transition-colors"
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
