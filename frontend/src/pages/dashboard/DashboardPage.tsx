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
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Sent</span>;
      case 'changes_requested':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Changes Requested</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-700 text-slate-300">Draft</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proposal Operations Center</h1>
          <p className="text-sm text-slate-400 mt-1">Overview of active client requirements, AI generations, and conversion statistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/proposals/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Proposal Generator</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Proposals</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-white">{stats?.total_proposals || 0}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Draft Proposals</span>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-slate-300">{stats?.draft_proposals || 0}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sent Proposals</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-blue-400">{stats?.sent_proposals || 0}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accepted Proposals</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-emerald-400">{stats?.accepted_proposals || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Proposals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Recent Proposals</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest generated documents and shared status.</p>
          </div>
          <Link to="/proposals" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {stats?.recent_proposals && stats.recent_proposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Proposal Title</th>
                  <th className="px-6 py-3.5">Project Type</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Value</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recent_proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      <Link to={`/proposals/${proposal.id}`} className="hover:text-blue-400 transition-colors">
                        {proposal.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">{proposal.project_type || 'Custom'}</td>
                    <td className="px-6 py-4">{getStatusBadge(proposal.status)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-200">${proposal.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/proposals/${proposal.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors inline-block"
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
            <FileText className="h-10 w-10 mx-auto text-slate-600" />
            <p className="text-sm">No proposals generated yet.</p>
            <Link
              to="/proposals/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
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
