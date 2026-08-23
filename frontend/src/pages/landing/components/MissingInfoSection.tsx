import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, XCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MissingInfoSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-950/80 border-t border-b border-slate-800/80 px-6 lg:px-12 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Eliminate Scope Creep Before It Starts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Smart Missing Info & Risk Detection
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Traditional proposals miss critical technical assumptions leading to unpaid extra work. ProposifyAI identifies missing requirements before contract sign-off.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-7 rounded-3xl bg-red-950/10 border border-red-500/20 space-y-5 relative overflow-hidden backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <XCircle className="h-5 w-5" />
                <span>Traditional Generic Proposal</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase">
                High Risk
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Vague feature definitions ("Build a custom dashboard") without API rate limits or data volume specs.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Unclear third-party integration responsibilities leading to mid-project billing disputes.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>Manual guesswork for development timelines and milestone payments.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>No automated follow-ups or client engagement tracking.</span>
              </li>
            </ul>

            <div className="p-3.5 bg-red-950/40 rounded-xl border border-red-500/20 text-xs text-red-300 font-mono">
              ❌ Result: Average 28% budget overruns & uncompensated scope creep.
            </div>
          </motion.div>

          {/* ProposifyAI Smart Way */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-7 rounded-3xl bg-emerald-950/15 border border-emerald-500/30 space-y-5 relative overflow-hidden backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <span>ProposifyAI Smart Analysis</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                Zero Scope Creep
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>AI flags missing technical specs (Auth provider, payment gateways, SLA) and suggests clarifying questions.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Automated milestone pricing breakdown based on complexity & estimated hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Printable PDF generation with agency branding & contract terms.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Real-time client portal with instant PDF download & e-signature approval.</span>
              </li>
            </ul>

            <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-mono">
              ✅ Result: 3x faster proposal sign-offs & 100% accurate project margins.
            </div>
          </motion.div>
        </div>

        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-500/25 transition-all"
          >
            <span>Protect Your Project Margins Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
