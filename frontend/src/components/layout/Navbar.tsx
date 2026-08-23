import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, User as UserIcon, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 group-hover:shadow-violet-500/40 transition-all duration-300 animate-float">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-violet-300">
            Proposify<span className="text-violet-400">AI</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-violet-500/20 text-xs text-slate-300 shadow-inner">
              <Building2 className="h-3.5 w-3.5 text-violet-400" />
              <span className="font-medium">{user.company_name || 'My Agency'}</span>
            </div>
            
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-violet-500/20 border border-violet-400/30">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-200">{user.full_name || 'User'}</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-all ml-1 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
