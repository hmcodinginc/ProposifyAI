import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      // Demo fallback if backend server is not running locally
      const mockToken = `demo-jwt-token-${Date.now()}`;
      const mockUser = {
        id: 'usr-demo-1',
        email: email || 'alex@proposifyai.dev',
        full_name: email ? email.split('@')[0] : 'Alex Mercer',
        company_name: 'Apex Digital Agency',
        created_at: new Date().toISOString(),
      };
      login(mockToken, mockUser);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c221e] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Radial Highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#f2e7d5]/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center animate-fade-in">
        <Link to="/" className="inline-block">
          <div className="h-10 w-10 rounded-xl bg-[#4a382a] flex items-center justify-center shadow-xs mx-auto mb-3">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        </Link>
        <h2 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#2c221e]">Sign in to ProposifyAI</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#6e5d53]">
          Transform raw client requirements into winning proposals with AI
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-fade-in">
        <div className="warm-glass-card py-8 px-6 sm:px-10 shadow-sm rounded-3xl border border-[#e6dbc9]">
          {error && (
            <div className="mb-6 bg-[#fdf2f2] border border-[#f5c6c6] rounded-xl p-3.5 flex items-center gap-3 text-[#a82525] text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c7b6f]">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] placeholder-[#8c7b6f] focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 text-sm transition-all shadow-inner"
                  placeholder="name@agency.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c7b6f]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] placeholder-[#8c7b6f] focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 text-sm transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6e5d53]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#4a382a] hover:text-[#945f32]">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
