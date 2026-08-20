import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { PublicProposal } from '../../types';
import { Sparkles, Download, CheckCircle2, MessageSquare, AlertCircle, Building2, Check, Clock } from 'lucide-react';

export const PublicProposalPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [proposal, setProposal] = useState<PublicProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [feedback, setFeedback] = useState('');
  const [actionDone, setActionDone] = useState<string | null>(null);
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
      setActionDone(action);
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md p-8 text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Proposal Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'This proposal link is invalid or no longer accessible.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header Card with Branding */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {proposal.company_name || 'Business Proposal'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{proposal.title}</h1>
            <p className="text-xs text-slate-400">
              Prepared for <span className="font-semibold text-slate-200">{proposal.client_name || 'Valued Client'}</span> • Created {new Date(proposal.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all shadow-md"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Status Alert Banner if already acted upon */}
        {proposal.status === 'accepted' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>This proposal was accepted! Our team will contact you shortly for kickoff.</span>
          </div>
        )}
        {proposal.status === 'changes_requested' && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center gap-3 text-amber-400 text-sm font-semibold">
            <MessageSquare className="h-5 w-5 shrink-0" />
            <span>Changes were requested. We are reviewing your feedback and will update the proposal.</span>
          </div>
        )}

        {/* Proposal Document Body */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-8">
          {proposal.sections?.map((sec, idx) => (
            <div key={idx} className="space-y-3 border-b border-slate-800/80 pb-6 last:border-none">
              <h2 className="text-xl font-bold text-blue-400">{sec.title}</h2>
              <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{sec.content}</div>
            </div>
          ))}

          {/* Pricing & Investment Table */}
          {proposal.pricing_items && proposal.pricing_items.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-xl font-bold text-white">Pricing & Investment Breakdown</h2>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900 text-xs uppercase text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-4">Milestone / Deliverable</th>
                      <th className="p-4">Description</th>
                      <th className="p-4 text-right">Est. Hours</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {proposal.pricing_items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-4 font-semibold text-white">{item.title}</td>
                        <td className="p-4 text-xs text-slate-400">{item.description || '-'}</td>
                        <td className="p-4 text-right font-semibold">{item.hours} hrs</td>
                        <td className="p-4 text-right font-bold text-emerald-400">${item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 border-t border-slate-800 font-bold">
                    <tr>
                      <td colSpan={3} className="p-4 text-right text-slate-200">TOTAL ESTIMATED INVESTMENT:</td>
                      <td className="p-4 text-right text-emerald-400 text-lg">${proposal.total_price.toLocaleString()} {proposal.currency}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Client Action Box (Accept or Request Changes) */}
        {proposal.status !== 'accepted' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Review & Action</h3>
              <p className="text-xs text-slate-400 mt-1">Accept this proposal to initiate the project or send us feedback for adjustments.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Feedback or Requested Changes (Optional)
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add comments, timeline preferences, or requested modifications..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAction('accept')}
                disabled={submittingAction}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Accept Proposal</span>
              </button>

              <button
                onClick={() => handleAction('request_changes')}
                disabled={submittingAction}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Request Changes</span>
              </button>
            </div>
          </div>
        )}

        <footer className="text-center text-xs text-slate-500 pt-4">
          Powered by <span className="font-semibold text-slate-400">ProposifyAI</span> • Confidential Business Proposal
        </footer>
      </div>
    </div>
  );
};
