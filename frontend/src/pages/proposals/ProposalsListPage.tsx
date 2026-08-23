import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Proposal } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, Wand2, Search, Filter, Trash2, Edit3, Share2, Download, ExternalLink, Copy, Check } from 'lucide-react';

export const ProposalsListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ['proposals', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all' ? '/proposals' : `/proposals?status_filter=${statusFilter}`;
      const res = await api.get(url);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/proposals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
  });

  const handleCopyShareLink = (token: string) => {
    const fullUrl = `${window.location.origin}/p/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDownloadPDF = async (proposalId: string, title: string) => {
    try {
      const response = await api.post(`/proposals/${proposalId}/pdf`, {}, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}_proposal.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const filteredProposals = proposals?.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.project_type && p.project_type.toLowerCase().includes(search.toLowerCase()))
  );

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card flex flex-col items-center justify-center text-center gap-4 p-8 rounded-3xl border border-violet-500/20 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Proposals Repository</h1>
          <p className="text-sm text-slate-400 mt-1 text-center">Manage, edit, export, and track your generated business proposals.</p>
        </div>
        <Link
          to="/proposals/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all transform active:scale-95"
        >
          <Wand2 className="h-4 w-4" />
          <span>New AI Proposal</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-3 bg-[#090d16] border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-center transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 glass-card border border-slate-800 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {['all', 'draft', 'sent', 'accepted', 'changes_requested'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredProposals && filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-violet-300 font-semibold px-3 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                    {proposal.project_type || 'Custom'}
                  </span>
                  {getStatusBadge(proposal.status)}
                </div>

                <h3 className="font-bold text-white text-lg leading-snug line-clamp-2 text-center">
                  <Link to={`/proposals/${proposal.id}`} className="hover:text-violet-400 transition-colors">
                    {proposal.title}
                  </Link>
                </h3>
              </div>

              <div className="border-t border-b border-slate-800/80 py-3 space-y-1 text-center">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Investment:</span>
                  <span className="font-extrabold text-white text-base">${proposal.total_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Est. Timeline:</span>
                  <span>{proposal.estimated_duration_days} Days</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyShareLink(proposal.token)}
                    title="Copy Shareable Link"
                    className="p-2 text-slate-400 hover:text-violet-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    {copiedToken === proposal.token ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(proposal.id, proposal.title)}
                    title="Download PDF"
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this proposal?')) {
                        deleteMutation.mutate(proposal.id);
                      }
                    }}
                    title="Delete Proposal"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  to={`/proposals/${proposal.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/20 border border-violet-500/30 text-violet-300 hover:bg-violet-600/30 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Open Editor</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-400">
          <FileText className="h-10 w-10 mx-auto text-slate-600 mb-3 animate-float" />
          <p className="text-sm font-medium text-center">No proposals matching your filter.</p>
          <Link
            to="/proposals/new"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Create Proposal
          </Link>
        </div>
      )}
    </div>
  );
};
