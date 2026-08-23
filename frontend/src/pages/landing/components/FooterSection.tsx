import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FooterSection: React.FC = () => {
  return (
    <footer className="border-t border-[#e6dbc9] bg-[#f5efe6] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12 space-y-16 relative z-10">
        <div className="warm-glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-[#e3d7c5] max-w-4xl mx-auto bg-gradient-to-b from-[#fcfbf8] to-[#f5efe6]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-[#4a382a]" />
            <span>Ready To Close Deals 3x Faster?</span>
          </div>
          <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
            Join 500+ Software Agencies & Consultants
          </h2>
          <p className="text-sm text-[#6e5d53] max-w-xl mx-auto">
            Stop spending hours writing manual proposals. Generate structured, scope-checked client proposals in under two minutes.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-md transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Get Started Free Today</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-[#4a382a] flex items-center justify-center shadow-xs">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-serif-title font-bold text-xl text-[#2c221e]">
                ProposifyAI
              </span>
            </Link>
            <p className="text-[#6e5d53] leading-relaxed">
              AI-powered business proposal generator converting client requirements into signed contracts.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#2c221e] uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2 text-[#6e5d53]">
              <li><a href="#demo" className="hover:text-[#2c221e] transition-colors">AI Analyzer</a></li>
              <li><a href="#templates" className="hover:text-[#2c221e] transition-colors">Proposal Templates</a></li>
              <li><a href="#pricing" className="hover:text-[#2c221e] transition-colors">Pricing Plans</a></li>
              <li><Link to="/register" className="hover:text-[#2c221e] transition-colors">PDF Exporter</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#2c221e] uppercase tracking-wider text-[11px]">Resources</h4>
            <ul className="space-y-2 text-[#6e5d53]">
              <li><a href="#faq" className="hover:text-[#2c221e] transition-colors">Documentation</a></li>
              <li><a href="#faq" className="hover:text-[#2c221e] transition-colors">Proposal Best Practices</a></li>
              <li><a href="#faq" className="hover:text-[#2c221e] transition-colors">API & Integrations</a></li>
              <li><a href="#faq" className="hover:text-[#2c221e] transition-colors">Release Notes</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#2c221e] uppercase tracking-wider text-[11px]">System Status</h4>
            <div className="flex items-center gap-2 text-[#2e6b22] font-medium">
              <span className="h-2 w-2 rounded-full bg-[#2e6b22] animate-ping" />
              <span>All Systems Operational</span>
            </div>
            <p className="text-[#8c7b6f]">Qwen3 AI Model Engine Online</p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e6dbc9] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8c7b6f] text-xs">
          <div>
            © {new Date().getFullYear()} ProposifyAI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#2c221e] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#2c221e] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#2c221e] transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
