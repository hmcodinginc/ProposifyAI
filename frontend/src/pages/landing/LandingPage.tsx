import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { LiveDemoSection } from './components/LiveDemoSection';
import { TemplateShowcase } from './components/TemplateShowcase';
import { MissingInfoSection } from './components/MissingInfoSection';
import { FeaturesGridSection } from './components/FeaturesGridSection';
import { PricingSection } from './components/PricingSection';
import { FooterSection } from './components/FooterSection';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c221e] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#4a382a] selection:text-white relative overflow-hidden">
      {/* Editorial Navigation Header */}
      <nav className="h-20 border-b border-[#e8ded0] px-6 lg:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#faf7f2]/90 transition-all">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#4a382a] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif-title font-bold text-2xl tracking-tight text-[#2c221e]">
              ProposifyAI
            </span>
          </Link>

          {/* Section Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#6e5d53]">
            <a href="#demo" className="hover:text-[#2c221e] transition-colors">AI Demo</a>
            <a href="#templates" className="hover:text-[#2c221e] transition-colors">Templates</a>
            <a href="#features" className="hover:text-[#2c221e] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[#2c221e] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-xs transition-all flex items-center gap-2"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-xs sm:text-sm font-semibold text-[#52443a] hover:text-[#2c221e] px-3 py-2 transition-colors">
                  Dashboard
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-xs transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>Start drafting</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Page Sections */}
      <main className="pt-8">
        <HeroSection user={user} />
        
        <div id="demo">
          <LiveDemoSection user={user} />
        </div>

        <div id="templates">
          <TemplateShowcase />
        </div>

        <MissingInfoSection />

        <div id="features">
          <FeaturesGridSection />
        </div>

        <div id="pricing">
          <PricingSection />
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
