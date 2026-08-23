import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, ArrowRight, CheckCircle2, ChevronRight, FileCheck, ShieldCheck, Zap, Layers } from 'lucide-react';

interface HeroSectionProps {
  user: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center z-10">
      {/* Background Animated Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-violet-600/25 via-indigo-600/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-40 left-12 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute top-60 right-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 max-w-5xl mx-auto"
      >
        {/* Animated Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-inner shadow-violet-500/10 backdrop-blur-md hover:border-violet-400/50 transition-all cursor-default">
          <Sparkles className="h-3.5 w-3.5 text-violet-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Next-Gen AI Business Proposal Generator</span>
          <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-ping" />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
          Turn Raw Requirements Into{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 drop-shadow-sm">
            Winning Proposals
          </span>{' '}
          In Seconds
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          ProposifyAI analyzes client briefs, detects missing requirements, calculates project scope & milestone pricing, and exports agency-branded PDF proposals instantly.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? "/proposals/new" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-600/30 transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 group"
          >
            <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            <span>Generate Free Proposal</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-violet-500/50 text-slate-200 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg backdrop-blur-md"
          >
            <span>Try Interactive AI Demo</span>
            <ChevronRight className="h-4 w-4 text-violet-400" />
          </a>
        </div>

        {/* Feature Highlights Bar */}
        <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300 font-medium border-t border-slate-800/80 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
            <span>ReportLab PDF Export</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
            <span>Scope Risk Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
            <span>Shareable Client Link</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
