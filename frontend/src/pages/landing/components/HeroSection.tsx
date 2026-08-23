import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';

interface HeroSectionProps {
  user: any;
}

const CLIENT_LOGOS = [
  'Meridian Health',
  'Cedar Freight',
  'Atlas Fitness',
  'Lumen Studio',
  'Harbor & Co',
  'Northwind',
  'Meridian Health',
  'Cedar Freight',
  'Atlas Fitness'
];

export const HeroSection: React.FC<HeroSectionProps> = ({ user }) => {
  return (
    <section className="relative pt-20 pb-16 px-6 lg:px-12 max-w-7xl mx-auto text-center z-10">
      {/* Subtle Warm Radial Glow Background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#f2e7d5]/60 via-[#eddcc8]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-7 max-w-4xl mx-auto"
      >
        {/* Engine Badge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-medium shadow-xs cursor-default">
          <span className="h-2 w-2 rounded-full bg-[#e07a38] animate-pulse" />
          <span>Powered by a local Qwen3 engine</span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="font-serif-title text-5xl sm:text-7xl lg:text-8xl font-normal text-[#2c221e] tracking-tight leading-[1.08] max-w-4xl mx-auto">
          Client requirements in.<br />
          <span className="bronze-gradient-text italic font-serif-title font-normal">Professional</span> proposals out.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#6e5d53] max-w-2xl mx-auto leading-relaxed font-normal">
          ProposifyAI reads the brief, asks for what's missing, and drafts scope, deliverables, pricing and timeline — ready to review and export as a PDF.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
          <Link
            to={user ? "/proposals/new" : "/register"}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-md shadow-[#4a382a]/15 transition-all duration-200 flex items-center justify-center gap-2.5 transform hover:-translate-y-0.5 active:scale-95 group"
          >
            <span>Generate a proposal</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3] transition-all duration-200 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            <FileText className="h-4 w-4 text-[#6e5d53]" />
            <span>See example proposals</span>
          </a>
        </div>
      </motion.div>

      {/* Client Logo Marquee Bar */}
      <div className="mt-20 pt-8 border-t border-[#e8ded0] max-w-6xl mx-auto overflow-hidden">
        <div className="flex items-center justify-between gap-8 opacity-60 text-xs font-serif-title font-semibold text-[#6e5d53] uppercase tracking-wider overflow-x-auto py-2">
          {CLIENT_LOGOS.map((name, idx) => (
            <span key={idx} className="whitespace-nowrap hover:opacity-100 transition-opacity">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
