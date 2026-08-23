import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MissingInfoSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#f5efe6]/70 border-t border-b border-[#e6dbc9] px-6 lg:px-12 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#7c5228] text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-[#a86523]" />
            <span>Eliminate Scope Creep Before It Starts</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
            Smart Missing Info & Risk Detection
          </h2>
          <p className="text-sm text-[#6e5d53] max-w-2xl mx-auto">
            Traditional proposals miss critical technical assumptions leading to unpaid extra work. ProposifyAI identifies missing requirements before contract sign-off.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-7 rounded-3xl bg-[#fdf2f2] border border-[#f5c6c6] space-y-5 relative overflow-hidden shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#f5c6c6] pb-4">
              <div className="flex items-center gap-2 text-[#a82525] font-bold text-base">
                <XCircle className="h-5 w-5" />
                <span>Traditional Generic Proposal</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#fae1e1] text-[#a82525] text-[10px] font-extrabold uppercase">
                High Risk
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-[#5c3030]">
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#a82525] flex-shrink-0 mt-0.5" />
                <span>Vague feature definitions ("Build a custom dashboard") without API rate limits or data volume specs.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#a82525] flex-shrink-0 mt-0.5" />
                <span>Unclear third-party integration responsibilities leading to mid-project billing disputes.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#a82525] flex-shrink-0 mt-0.5" />
                <span>Manual guesswork for development timelines and milestone payments.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-[#a82525] flex-shrink-0 mt-0.5" />
                <span>No automated follow-ups or client engagement tracking.</span>
              </li>
            </ul>

            <div className="p-3.5 bg-[#fce8e8] rounded-xl border border-[#f5c6c6] text-xs text-[#8c1c1c] font-mono">
              ❌ Result: Average 28% budget overruns & uncompensated scope creep.
            </div>
          </motion.div>

          {/* ProposifyAI Smart Way */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-7 rounded-3xl bg-[#eef5eb] border border-[#cbe3c5] space-y-5 relative overflow-hidden shadow-md"
          >
            <div className="flex items-center justify-between border-b border-[#cbe3c5] pb-4">
              <div className="flex items-center gap-2 text-[#2e6b22] font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <span>ProposifyAI Smart Analysis</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#d8ebcf] text-[#2e6b22] text-[10px] font-extrabold uppercase">
                Zero Scope Creep
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-[#294a20]">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                <span>AI flags missing technical specs (Auth provider, payment gateways, SLA) and suggests clarifying questions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                <span>Automated milestone pricing breakdown based on complexity & estimated hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                <span>Printable PDF generation with agency branding & contract terms.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#2e6b22] flex-shrink-0 mt-0.5" />
                <span>Real-time client portal with instant PDF download & e-signature approval.</span>
              </li>
            </ul>

            <div className="p-3.5 bg-[#e1f0dc] rounded-xl border border-[#cbe3c5] text-xs text-[#23521a] font-mono">
              ✅ Result: 3x faster proposal sign-offs & 100% accurate project margins.
            </div>
          </motion.div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#4a382a] hover:bg-[#382a1e] text-white text-sm font-semibold shadow-md transition-all"
          >
            <span>Protect Your Project Margins Now</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
