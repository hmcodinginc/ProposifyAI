import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, LogOut, Building2, Menu, X, Home, LayoutDashboard, FileText, Users, Wand2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#faf7f2]/95 backdrop-blur-md border-b border-[#e8ded0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[#4a382a] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif-title font-bold text-2xl tracking-tight text-[#2c221e]">
            ProposifyAI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5] text-xs text-[#6e5d53] shadow-xs">
              <Building2 className="h-3.5 w-3.5 text-[#4a382a]" />
              <span className="font-semibold text-[#2c221e]">{user.company_name || 'My Agency'}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-3 border-l border-[#e8ded0] pl-4">
              <div className="h-8 w-8 rounded-full bg-[#4a382a] text-white font-bold text-xs flex items-center justify-center shadow-xs border border-[#382a1e]">
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#2c221e]">{user.full_name || 'User'}</p>
                <p className="text-[10px] text-[#8c7b6f]">{user.email}</p>
              </div>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-[#6e5d53] hover:text-[#a82525] hover:bg-[#eee6da] rounded-xl transition-all ml-1 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#2c221e] hover:bg-[#eee6da] rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs sm:text-sm font-semibold text-[#52443a] hover:text-[#2c221e] px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-xs transition-all"
            >
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && user && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#faf7f2] border-b border-[#e8ded0] p-4 shadow-xl space-y-3 z-50 animate-fade-in">
          <Link
            to="/proposals/new"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#4a382a] text-white shadow-sm"
          >
            <Wand2 className="h-4 w-4" />
            <span>Generate Proposal</span>
          </Link>
          
          <nav className="space-y-1 text-xs">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2c221e] hover:bg-[#eee6da]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#4a382a]" />
              <span>Overview Dashboard</span>
            </NavLink>
            <NavLink
              to="/proposals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2c221e] hover:bg-[#eee6da]"
            >
              <FileText className="h-4 w-4 text-[#4a382a]" />
              <span>Proposals Repository</span>
            </NavLink>
            <NavLink
              to="/clients"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2c221e] hover:bg-[#eee6da]"
            >
              <Users className="h-4 w-4 text-[#4a382a]" />
              <span>Client Directory</span>
            </NavLink>
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#2c221e] hover:bg-[#eee6da]"
            >
              <Home className="h-4 w-4 text-[#4a382a]" />
              <span>Landing Page</span>
            </NavLink>
          </nav>

          <div className="pt-2 border-t border-[#e8ded0] flex items-center justify-between">
            <span className="text-xs font-bold text-[#2c221e]">{user.email}</span>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#a82525] flex items-center gap-1"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
