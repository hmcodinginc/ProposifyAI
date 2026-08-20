import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Wand2, PlusCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Proposals', path: '/proposals', icon: FileText },
    { label: 'Clients CRM', path: '/clients', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div className="px-2">
          <NavLink
            to="/proposals/new"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all transform active:scale-95"
          >
            <Wand2 className="h-4 w-4" />
            <span>Generate Proposal</span>
          </NavLink>
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Main Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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

      <div className="p-3 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/50 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-semibold text-slate-200">AI Engine Online</span>
        </div>
        <p className="text-[11px] text-slate-400">Qwen3 / Ollama provider ready for requirement analysis & document synthesis.</p>
      </div>
    </aside>
  );
};
