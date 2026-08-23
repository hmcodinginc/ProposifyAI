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
    <aside className="w-64 shrink-0 bg-[#faf7f2] border-r border-[#e8ded0] hidden md:flex flex-col justify-between p-5 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        <div className="px-1">
          <NavLink
            to="/proposals/new"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all transform active:scale-95 group"
          >
            <Wand2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            <span>Generate Proposal</span>
          </NavLink>
        </div>

        <nav className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold text-[#8c7b6f] uppercase tracking-wider mb-2">Navigation</p>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#eee6da] text-[#2c221e] border border-[#e2d6c3] shadow-xs'
                  : 'text-[#6e5d53] hover:text-[#2c221e] hover:bg-[#f5efe6]'
              }`
            }
          >
            <Home className="h-4 w-4 shrink-0 text-[#4a382a]" />
            <span>Landing Page</span>
          </NavLink>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#eee6da] text-[#2c221e] border border-[#e2d6c3] shadow-xs'
                      : 'text-[#6e5d53] hover:text-[#2c221e] hover:bg-[#f5efe6]'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0 text-[#4a382a]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 bg-[#f5efe6] border border-[#e6dbc9] rounded-2xl shadow-xs space-y-1 mt-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#2e6b22] animate-pulse" />
          <span className="text-xs font-bold text-[#2c221e]">Qwen3 AI Engine</span>
        </div>
        <p className="text-[11px] text-[#6e5d53] leading-relaxed">Local AI provider online for requirement analysis & proposal synthesis.</p>
      </div>
    </aside>
  );
};
