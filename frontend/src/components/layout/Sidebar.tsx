import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Wand2, Home } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Overview Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Proposals Repository', path: '/proposals', icon: FileText },
    { label: 'Clients CRM', path: '/clients', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#0b0f19]/60 backdrop-blur-xl border-r border-slate-800/80 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-2">
          <NavLink
            to="/proposals/new"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all transform active:scale-95 group"
          >
            <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span>Generate Proposal</span>
          </NavLink>
        </div>

        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Navigation</p>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-violet-600/15 text-violet-400 border border-violet-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span>Landing Page</span>
          </NavLink>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-400 border border-violet-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-violet-500/20 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200">Qwen3 AI Engine</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">Ollama & fallback provider online for requirement analysis & document synthesis.</p>
      </div>
    </aside>
  );
};
