import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, DollarSign, HelpCircle, Layers, Download, Share2, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Wand2,
    title: 'AI Requirement Analyzer',
    desc: 'Parses unstructured client emails, meeting notes, and RFP documents to extract core features, user roles, and complexity ratings.',
    badge: 'Core Engine'
  },
  {
    icon: DollarSign,
    title: 'Pricing & Timeline Engine',
    desc: 'Calculates milestone distribution, working days, total budget, and phase breakdowns (Discovery, Design, Dev, QA, Deployment).',
    badge: 'Automated'
  },
  {
    icon: HelpCircle,
    title: 'Missing Info Detection',
    desc: 'Identifies underspecified client requirements and generates targeted clarifying questions before proposal finalization.',
    badge: 'Risk Mitigation'
  },
  {
    icon: Layers,
    title: 'Rich Proposal Editor',
    desc: 'Drag-and-drop section reordering, rich markdown editing, milestone pricing tables, and version revision snapshot history.',
    badge: 'Customizable'
  },
  {
    icon: Download,
    title: 'ReportLab PDF Export',
    desc: 'Generates print-ready PDF proposals with your agency logo, typography, table styling, and custom terms.',
    badge: 'Print-Ready'
  },
  {
    icon: Share2,
    title: 'Shareable Client Portal',
    desc: 'Unique public link where clients view styled proposals, download PDFs, and click to Accept or Request Changes.',
    badge: 'Real-Time'
  }
];

export const FeaturesGridSection: React.FC = () => {
  return (
    <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-[#6e5d53] text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-[#4a382a]" />
          <span>Full Agency Toolkit</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-5xl font-normal text-[#2c221e]">
          Everything You Need To Close Deals Faster
        </h2>
        <p className="text-sm text-[#6e5d53] max-w-xl mx-auto">
          Engineered for agencies, freelancers, and software consultants who want to convert briefs into signed contracts effortlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="warm-glass-card warm-card-hover p-6 rounded-3xl space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-[#eee6da] border border-[#e2d6c3] text-[#4a382a] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#4a382a] group-hover:text-white transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#f1eae0] text-[#6e5d53] border border-[#e3d7c5]">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2c221e] group-hover:text-[#945f32] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#6e5d53] leading-relaxed">
                  {feature.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e6dbc9] text-[11px] text-[#945f32] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
