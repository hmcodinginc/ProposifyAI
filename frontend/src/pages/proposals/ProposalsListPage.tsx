import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Proposal } from '../../types';
import { Link } from 'react-router-dom';
import { FileText, Wand2, Search, Trash2, Edit3, Share2, Download, Check } from 'lucide-react';

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
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#eef5eb] text-[#2e6b22] border border-[#cbe3c5]">Accepted</span>;
      case 'sent':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#f1eae0] text-[#4a382a] border border-[#e3d7c5]">Sent</span>;
      case 'changes_requested':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#fcf5eb] text-[#a86523] border border-[#f0dfcc]">Changes Requested</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#eee6da] text-[#6e5d53]">Draft</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="warm-glass-card flex flex-col sm:flex-row items-center justify-between p-8 rounded-3xl border border-[#e6dbc9] shadow-sm gap-6">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#2c221e] tracking-tight">Proposals Repository</h1>
          <p className="text-sm text-[#6e5d53] mt-1">Manage, edit, export, and track your generated business proposals.</p>
        </div>
        <Link
          to="/proposals/new"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
        >
          <Wand2 className="h-4 w-4" />
          <span>New AI Proposal</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c7b6f]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-3 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] placeholder-[#8c7b6f] focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 text-sm transition-all shadow-inner"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 warm-glass-card border border-[#e6dbc9] p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {['all', 'draft', 'sent', 'accepted', 'changes_requested'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-[#4a382a] text-white shadow-xs'
                  : 'text-[#6e5d53] hover:text-[#2c221e]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
        </div>
      ) : filteredProposals && filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProposals.map((proposal) => (
            <div key={proposal.id} className="warm-glass-card warm-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-4 border border-[#e6dbc9]">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#945f32] font-bold px-3 py-0.5 rounded-full bg-[#f1eae0] border border-[#e3d7c5]">
                    {proposal.project_type || 'Custom'}
                  </span>
                  {getStatusBadge(proposal.status)}
                </div>

                <h3 className="font-serif-title font-normal text-[#2c221e] text-xl leading-snug line-clamp-2">
                  <Link to={`/proposals/${proposal.id}`} className="hover:text-[#945f32] transition-colors">
                    {proposal.title}
                  </Link>
                </h3>
              </div>

              <div className="border-t border-b border-[#e6dbc9] py-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#6e5d53]">Total Investment:</span>
                  <span className="font-extrabold text-[#2c221e] text-base">${proposal.total_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-[#6e5d53]">
                  <span>Est. Timeline:</span>
                  <span className="font-semibold text-[#2c221e]">{proposal.estimated_duration_days} Days</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyShareLink(proposal.token)}
                    title="Copy Shareable Link"
                    className="p-2 text-[#6e5d53] hover:text-[#4a382a] hover:bg-[#eee6da] rounded-xl transition-colors"
                  >
                    {copiedToken === proposal.token ? <Check className="h-4 w-4 text-[#2e6b22]" /> : <Share2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(proposal.id, proposal.title)}
                    title="Download PDF"
                    className="p-2 text-[#6e5d53] hover:text-[#2e6b22] hover:bg-[#eee6da] rounded-xl transition-colors"
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
                    className="p-2 text-[#6e5d53] hover:text-[#a82525] hover:bg-[#eee6da] rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <Link
                  to={`/proposals/${proposal.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#eee6da] border border-[#e2d6c3] text-[#4a382a] hover:bg-[#e4dacb] transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Open Editor</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="warm-glass-card rounded-3xl p-12 text-center text-[#6e5d53] border border-[#e6dbc9]">
          <FileText className="h-10 w-10 mx-auto text-[#bfae97] mb-3" />
          <p className="text-sm font-medium">No proposals matching your filter.</p>
          <Link
            to="/proposals/new"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-[#4a382a] text-white rounded-xl text-xs font-bold hover:bg-[#382a1e] transition-colors shadow-sm"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Create Proposal
          </Link>
        </div>
      )}
    </div>
  );
};
