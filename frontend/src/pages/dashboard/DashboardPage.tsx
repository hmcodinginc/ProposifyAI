import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, Send, CheckCircle2, Clock, Users, Wand2, Plus, ExternalLink, Download } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Accepted</span>;
      case 'sent':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Sent</span>;
      case 'changes_requested':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Changes Requested</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300">Draft</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner / Welcome */}
      <div className="glass-card flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-r from-slate-900/90 via-violet-950/20 to-slate-900/90 p-8 rounded-3xl border border-violet-500/20 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Proposal Operations Center</h1>
          <p className="text-sm text-slate-400 mt-1 text-center">Overview of active client requirements, AI generations, and conversion statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/proposals/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Proposal Generator</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Proposals</span>
            <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-3xl font-extrabold text-white text-center">{stats?.total_proposals || 0}</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Proposals</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-3xl font-extrabold text-slate-300 text-center">{stats?.draft_proposals || 0}</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sent Proposals</span>
            <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-3xl font-extrabold text-violet-400 text-center">{stats?.sent_proposals || 0}</span>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl relative overflow-hidden group text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Proposals</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-center">
            <span className="text-3xl font-extrabold text-emerald-400 text-center">{stats?.accepted_proposals || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Proposals Table */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xl border border-slate-800/80">
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold text-white text-center">Recent Proposals</h2>
            <p className="text-xs text-slate-400 mt-0.5 text-center">Latest generated documents and shared status.</p>
          </div>
          <Link to="/proposals" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 shrink-0">
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {stats?.recent_proposals && stats.recent_proposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#090d16]/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5 text-center">Proposal Title</th>
                  <th className="px-6 py-3.5 text-center">Project Type</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-center">Value</th>
                  <th className="px-6 py-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recent_proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white text-center">
                      <Link to={`/proposals/${proposal.id}`} className="hover:text-violet-400 transition-colors">
                        {proposal.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 text-center">{proposal.project_type || 'Custom'}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(proposal.status)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200 text-center">${proposal.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/proposals/${proposal.id}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-block"
                      >
                        Edit / View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="h-10 w-10 mx-auto text-slate-600 animate-float" />
            <p className="text-sm text-center">No proposals generated yet.</p>
            <Link
              to="/proposals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
            >
              <Wand2 className="h-3.5 w-3.5" />
              Generate Your First Proposal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
