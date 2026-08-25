import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { PublicProposal } from '../../types';
import { Download, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const PublicProposalPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [feedback, setFeedback] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    const fetchPublicProposal = async () => {
      try {
        const res = await api.get(`/public/proposals/${token}`);
        setProposal(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Invalid or expired proposal link.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchPublicProposal();
    }
  }, [token]);

  const handleAction = async (action: 'accept' | 'request_changes') => {
    setSubmittingAction(true);
    try {
      await api.post(`/public/proposals/${token}/action`, { action, feedback });
      if (proposal) {
        setProposal({
          ...proposal,
          status: action === 'accept' ? 'accepted' : 'changes_requested',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/public/proposals/${token}/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center p-4">
        <div className="warm-glass-card border border-[#e6dbc9] rounded-3xl max-w-md p-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-[#a82525] mx-auto" />
          <h2 className="font-serif-title text-2xl font-bold text-[#2c221e]">Proposal Not Found</h2>
          <p className="text-sm text-[#6e5d53]">{error || 'This proposal link is invalid or no longer accessible.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#2c221e] py-10 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Top Header Card */}
        <div className="warm-glass-card border border-[#e6dbc9] p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#945f32]">
              {proposal.company_name || 'Business Proposal'}
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#2c221e] tracking-tight mt-1">{proposal.title}</h1>
            <p className="text-xs text-[#6e5d53] mt-1">
              Prepared for <span className="font-semibold text-[#2c221e]">{proposal.client_name || 'Valued Client'}</span> • Created {new Date(proposal.created_at).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3] transition-all shadow-xs shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Status Alert Banner */}
        {proposal.status === 'accepted' && (
          <div className="bg-[#eef5eb] border border-[#cbe3c5] p-4 rounded-2xl flex items-center justify-center gap-3 text-[#2e6b22] text-xs font-bold text-center">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>This proposal was accepted! Our team will contact you shortly for kickoff.</span>
          </div>
        )}
        {proposal.status === 'changes_requested' && (
          <div className="bg-[#fcf5eb] border border-[#f0dfcc] p-4 rounded-2xl flex items-center justify-center gap-3 text-[#a86523] text-xs font-bold text-center">
            <MessageSquare className="h-5 w-5 shrink-0" />
            <span>Changes were requested. We are reviewing your feedback and will update the proposal.</span>
          </div>
        )}

        {/* Proposal Document Body */}
        <div className="warm-glass-card border border-[#e6dbc9] rounded-3xl p-8 shadow-sm space-y-8">
          {proposal.sections?.map((sec, idx) => (
            <div key={idx} className="space-y-3 border-b border-[#e6dbc9] pb-6 last:border-none">
              <h2 className="font-serif-title text-2xl font-normal text-[#4a382a]">{sec.title}</h2>
              <div className="text-sm text-[#52443a] whitespace-pre-wrap leading-relaxed">{sec.content}</div>
            </div>
          ))}

          {/* Pricing Table */}
          {proposal.pricing_items && proposal.pricing_items.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#e6dbc9]">
              <h2 className="font-serif-title text-2xl font-normal text-[#2c221e]">Pricing & Investment Breakdown</h2>
              <div className="bg-[#fcfbf8] border border-[#e6dbc9] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm text-[#2c221e]">
                  <thead className="bg-[#f5efe6] text-xs uppercase text-[#6e5d53] border-b border-[#e6dbc9] font-bold">
                    <tr>
                      <th className="p-4">Milestone / Deliverable</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-center">Est. Hours</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6dbc9]">
                    {proposal.pricing_items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#f5efe6]">
                        <td className="p-4 font-bold text-[#2c221e]">{item.title}</td>
                        <td className="p-4 text-xs text-[#6e5d53]">{item.description || '-'}</td>
                        <td className="p-4 text-center font-bold">{item.hours} hrs</td>
                        <td className="p-4 text-right font-extrabold text-[#2e6b22]">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#f5efe6] border-t border-[#e6dbc9] font-bold">
                    <tr>
                      <td colSpan={3} className="p-4 text-[#2c221e]">TOTAL ESTIMATED INVESTMENT:</td>
                      <td className="p-4 text-right text-[#2e6b22] text-lg">${proposal.total_price.toLocaleString()} {proposal.currency}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Client Action Box */}
        {proposal.status !== 'accepted' && (
          <div className="warm-glass-card border border-[#e6dbc9] p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-serif-title text-2xl font-normal text-[#2c221e]">Review & Action</h3>
              <p className="text-xs text-[#6e5d53] mt-1">Accept this proposal to initiate the project or send us feedback for adjustments.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider">
                Feedback or Requested Changes (Optional)
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add comments, timeline preferences, or requested modifications..."
                className="w-full p-4 bg-[#fcfbf8] border border-[#e3d7c5] rounded-2xl text-[#2c221e] placeholder-[#8c7b6f] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 resize-none shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAction('accept')}
                disabled={submittingAction}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Accept Proposal</span>
              </button>

              <button
                onClick={() => handleAction('request_changes')}
                disabled={submittingAction}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3] transition-all disabled:opacity-50"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Request Changes</span>
              </button>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-[#8c7b6f] pt-4">
          Powered by <span className="font-bold text-[#2c221e]">ProposifyAI</span> • Confidential Business Proposal
        </footer>
      </div>
    </div>
  );
};
