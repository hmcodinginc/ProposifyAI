import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';
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
      {/* Header & Switcher */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-[#4a382a]" />
          <span>Simple, Transparent Pricing</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
          Predictable Pricing for Growing Agencies
        </h2>
        <p className="text-sm text-[#6e5d53] max-w-xl mx-auto">
          Start for free and scale as your client proposal pipeline grows. No hidden fees.
        </p>

        {/* Switcher */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-[#2c221e]' : 'text-[#6e5d53]'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-7 bg-[#eee6da] rounded-full p-1 border border-[#e2d6c3] transition-colors relative"
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#4a382a] transition-transform ${
                isAnnual ? 'translate-x-7 bg-[#945f32]' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-[#2c221e]' : 'text-[#6e5d53]'}`}>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-md bg-[#e2f0d9] text-[#2e6b22] text-[10px] font-bold">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <motion.div
          whileHover={{ y: -4 }}
          className="warm-glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#2c221e]">Starter</h3>
              <p className="text-xs text-[#6e5d53] mt-1">For freelancers getting started</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-[#2c221e]">
              $0 <span className="text-xs font-normal text-[#6e5d53]">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#52443a] pt-4 border-t border-[#e6dbc9]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>5 AI Proposals / month</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>ReportLab PDF Export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Shareable Client Links</span>
              </li>
              <li className="flex items-center gap-2.5 text-[#a89b90] line-through">
                <CheckCircle2 className="h-4 w-4 text-slate-300 flex-shrink-0" />
                <span>Custom Logo Branding</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3 bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] font-bold text-xs rounded-xl block text-center border border-[#e2d6c3] transition-colors"
          >
            Get Started Free
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-gradient-to-b from-[#f5efe6] via-[#faf7f2] to-[#f5efe6] border-2 border-[#4a382a] p-8 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-xl"
        >
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#4a382a] text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-md">
            Most Popular
          </span>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#2c221e]">Pro Agency</h3>
              <p className="text-xs text-[#6e5d53] mt-1">For growing agencies & teams</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-[#2c221e]">
              ${proPrice} <span className="text-xs font-normal text-[#6e5d53]">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#2c221e] pt-4 border-t border-[#e6dbc9]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Unlimited AI Proposals</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Custom Agency Logo & Branding</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Missing Requirements Risk Detector</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Version History & Audit Logs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Priority Email Support</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3.5 bg-[#4a382a] hover:bg-[#382a1e] text-white font-extrabold text-xs rounded-xl block text-center shadow-md transition-all active:scale-95"
          >
            Start 14-Day Free Trial
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="warm-glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#2c221e]">Enterprise</h3>
              <p className="text-xs text-[#6e5d53] mt-1">For large software houses</p>
            </div>
            <div className="pt-2 text-4xl font-extrabold text-[#2c221e]">
              ${entPrice} <span className="text-xs font-normal text-[#6e5d53]">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-[#52443a] pt-4 border-t border-[#e6dbc9]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Custom Private LLM / Ollama Endpoint</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Multi-Seat Team Accounts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>White-Label Custom Domain Links</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0" />
                <span>Dedicated Account Manager</span>
              </li>
            </ul>
          </div>

          <Link
            to="/register"
            className="w-full py-3 bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] font-bold text-xs rounded-xl block text-center border border-[#e2d6c3] transition-colors"
          >
            Contact Sales
          </Link>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto pt-8 space-y-6">
        <div className="text-center space-y-2">
          <h3 className="font-serif-title text-2xl sm:text-3xl font-normal text-[#2c221e]">Frequently Asked Questions</h3>
          <p className="text-xs text-[#6e5d53]">Got questions? We've got answers.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="warm-glass-card rounded-2xl border border-[#e6dbc9] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#2c221e] hover:text-[#945f32] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#4a382a] transition-transform ${
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
                    className="px-5 pb-5 text-xs text-[#6e5d53] leading-relaxed border-t border-[#e6dbc9] pt-3"
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
