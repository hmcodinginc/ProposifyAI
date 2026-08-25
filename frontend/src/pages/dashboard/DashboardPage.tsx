import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, Send, CheckCircle2, Clock, Wand2, ExternalLink } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#eef5eb] text-[#2e6b22] border border-[#cbe3c5]">Accepted</span>;
      case 'sent':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#f1eae0] text-[#4a382a] border border-[#e3d7c5]">Sent</span>;
      case 'changes_requested':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#fcf5eb] text-[#a86523] border border-[#f0dfcc]">Changes Requested</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#eee6da] text-[#6e5d53]">Draft</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="warm-glass-card flex flex-col sm:flex-row items-center justify-between p-8 rounded-3xl border border-[#e6dbc9] shadow-sm gap-6">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#2c221e] tracking-tight">Proposal Operations Center</h1>
          <p className="text-sm text-[#6e5d53] mt-1">Overview of active client requirements, AI generations, and conversion statistics.</p>
        </div>
        <Link
          to="/proposals/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
        >
          <Wand2 className="h-4 w-4" />
          <span>AI Proposal Generator</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="warm-glass-card warm-card-hover p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6e5d53] uppercase tracking-wider">Total Proposals</span>
            <div className="p-2.5 rounded-xl bg-[#eee6da] text-[#4a382a] border border-[#e2d6c3]">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-[#2c221e]">{stats?.total_proposals || 0}</span>
          </div>
        </div>

        <div className="warm-glass-card warm-card-hover p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6e5d53] uppercase tracking-wider">Draft Proposals</span>
            <div className="p-2.5 rounded-xl bg-[#eee6da] text-[#6e5d53]">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-[#6e5d53]">{stats?.draft_proposals || 0}</span>
          </div>
        </div>

        <div className="warm-glass-card warm-card-hover p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6e5d53] uppercase tracking-wider">Sent Proposals</span>
            <div className="p-2.5 rounded-xl bg-[#f1eae0] text-[#4a382a] border border-[#e3d7c5]">
              <Send className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-[#4a382a]">{stats?.sent_proposals || 0}</span>
          </div>
        </div>

        <div className="warm-glass-card warm-card-hover p-6 rounded-3xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6e5d53] uppercase tracking-wider">Accepted Proposals</span>
            <div className="p-2.5 rounded-xl bg-[#eef5eb] text-[#2e6b22] border border-[#cbe3c5]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-extrabold text-[#2e6b22]">{stats?.accepted_proposals || 0}</span>
          </div>
        </div>
      </div>

      {/* Recent Proposals Table */}
      <div className="warm-glass-card rounded-3xl overflow-hidden shadow-sm border border-[#e6dbc9]">
        <div className="p-6 border-b border-[#e6dbc9] flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl font-normal text-[#2c221e]">Recent Proposals</h2>
            <p className="text-xs text-[#6e5d53] mt-0.5">Latest generated documents and client portal activity.</p>
          </div>
          <Link to="/proposals" className="text-xs font-bold text-[#4a382a] hover:text-[#945f32] flex items-center gap-1 shrink-0">
            View All <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {stats?.recent_proposals && stats.recent_proposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#2c221e]">
              <thead className="bg-[#f5efe6] text-xs uppercase text-[#6e5d53] border-b border-[#e6dbc9] font-bold">
                <tr>
                  <th className="px-6 py-4">Proposal Title</th>
                  <th className="px-6 py-4">Project Type</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Value</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dbc9]/60 bg-[#fcfbf8]">
                {stats.recent_proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-[#f5efe6] transition-colors">
                    <td className="px-6 py-4 font-bold text-[#2c221e]">
                      <Link to={`/proposals/${proposal.id}`} className="hover:text-[#945f32] transition-colors">
                        {proposal.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#6e5d53]">{proposal.project_type || 'Custom'}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(proposal.status)}</td>
                    <td className="px-6 py-4 font-bold text-[#2c221e] text-right">${proposal.total_price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/proposals/${proposal.id}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3] transition-colors inline-block"
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
          <div className="p-12 text-center text-[#6e5d53] space-y-3">
            <FileText className="h-10 w-10 mx-auto text-[#bfae97]" />
            <p className="text-sm">No proposals generated yet.</p>
            <Link
              to="/proposals/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#4a382a] text-white hover:bg-[#382a1e] transition-colors shadow-sm"
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
