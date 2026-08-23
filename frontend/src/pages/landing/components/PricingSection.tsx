import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, HelpCircle, ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How does the AI Requirement Analyzer work?',
    a: 'Simply paste your client email, requirements doc, or meeting notes. Qwen3 AI parses the text, extracts key deliverables, rates complexity, detects missing info, and generates milestone pricing.'
  },
  {
    q: 'Can I export proposals to branded PDFs?',
    a: 'Yes! ProposifyAI uses ReportLab to generate clean, print-ready PDF proposals with your agency logo, primary brand color, table styling, and custom legal terms.'
  },
  {
    q: 'How do shareable client links work?',
    a: 'Each proposal generates a unique tokenized URL (`/p/:token`). Clients can open the interactive web proposal, view milestones, download the PDF, and click to Accept or Request Revisions.'
  },
  {
    q: 'Can I connect my own custom LLM or Ollama instance?',
    a: 'Yes, on the Enterprise plan, you can configure your own private LLM endpoint, custom system prompts, and custom API keys for total data privacy.'
  }
];

export const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  const factor = isAnnual ? 0.8 : 1;
  const proPrice = Math.round(49 * factor);
  const entPrice = Math.round(99 * factor);

  return (
    <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto space-y-16">
      {/* Header & Toggle */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Predictable Pricing for Growing Agencies
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Start for free and scale as your client proposal pipeline grows. No hidden fees.
        </p>

        {/* Billing Switcher */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-slate-800 rounded-full p-1 border border-slate-700 transition-colors relative"
          >
            <div
              className={`w-5 h-5 rounded-full bg-violet-500 transition-transform ${
                isAnnual ? 'translate-x-7 bg-indigo-400' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Starter Plan */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <p className="text-xs text-slate-400 mt-1">For freelancers getting started</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-white">
              $0 <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>5 AI Proposals / month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>ReportLab PDF Export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Shareable Client Links</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500 line-through">
                <CheckCircle2 className="h-4 w-4 text-slate-600 flex-shrink-0" />
                <span>Custom Logo Branding</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl block text-center border border-slate-800 transition-colors"
          >
            Get Started Free
          </Link>
        </motion.div>

        {/* Pro Agency Plan (Popular) */}
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-gradient-to-b from-violet-950/70 via-slate-900 to-[#0b0f19] border-2 border-violet-500 p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-violet-500/20"
        >
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-md">
            Most Popular
          </span>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-white">Pro Agency</h3>
              <p className="text-xs text-slate-300 mt-1">For growing agencies & teams</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-white">
              ${proPrice} <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Unlimited AI Proposals</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Custom Agency Logo & Branding</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Missing Requirements Risk Detector</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Version History & Audit Logs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Priority Email Support</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl block text-center shadow-lg shadow-violet-500/30 transition-all active:scale-95"
          >
            Start 14-Day Free Trial
          </Link>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          whileHover={{ y: -4 }}
          className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise</h3>
              <p className="text-xs text-slate-400 mt-1">For large software houses</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-white">
              ${entPrice} <span className="text-xs font-normal text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Custom Private LLM / Ollama Endpoint</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Multi-Seat Team Accounts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>White-Label Custom Domain Links</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Dedicated Account Manager</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl block text-center border border-slate-800 transition-colors"
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto pt-8 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-400">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-200 hover:text-white transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-violet-400 transition-transform ${
                    expandedFaq === idx ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
              <AnimatePresence>
                {expandedFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
