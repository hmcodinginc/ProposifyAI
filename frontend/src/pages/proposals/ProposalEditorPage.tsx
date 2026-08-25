import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Proposal, ProposalSection, PricingItem, ProposalVersion } from '../../types';
import { Save, Download, Share2, Plus, Trash2, ArrowUp, ArrowDown, History, Check, Copy } from 'lucide-react';

export const ProposalEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('');
  const [status, setStatus] = useState('draft');
  const [sections, setSections] = useState<ProposalSection[]>([]);
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(75.0);

  const [activeTab, setActiveTab] = useState<'content' | 'pricing' | 'versions'>('content');
  const [copiedLink, setCopiedLink] = useState(false);
  const [versions, setVersions] = useState<ProposalVersion[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const { data: proposal, isLoading } = useQuery<Proposal>({
    queryKey: ['proposal', id],
    queryFn: async () => {
      const res = await api.get(`/proposals/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (proposal) {
      setTitle(proposal.title);
      setProjectType(proposal.project_type || '');
      setStatus(proposal.status);
      setSections(proposal.sections || []);
      setPricingItems(proposal.pricing_items || []);
      setHourlyRate(proposal.hourly_rate || 75.0);
    }
  }, [proposal]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const totalPrice = pricingItems.reduce((acc, item) => acc + item.amount, 0);
      return api.put(`/proposals/${id}`, {
        title,
        project_type: projectType,
        status,
        total_price: totalPrice,
        hourly_rate: hourlyRate,
        sections,
        pricing_items: pricingItems,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposal', id] });
      alert('Proposal saved successfully! A new version snapshot was recorded.');
    },
  });

  const fetchVersions = async () => {
    try {
      const res = await api.get(`/proposals/${id}/versions`);
      setVersions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.post(`/proposals/${id}/pdf`, {}, { responseType: 'blob' });
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

  const handleCopyShareLink = () => {
    if (!proposal) return;
    const fullUrl = `${window.location.origin}/p/${proposal.token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Section Manipulation
  const handleAddSection = () => {
    const newSec: ProposalSection = {
      section_type: 'custom',
      title: 'New Custom Section',
      content: 'Add section content here...',
      order_index: sections.length,
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const updated = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((s, idx) => (s.order_index = idx));
    setSections(updated);
  };

  // Pricing Manipulation
  const handleAddPricingItem = () => {
    const newItem: PricingItem = {
      title: 'New Milestone Item',
      description: 'Milestone description',
      hours: 10,
      rate: hourlyRate,
      amount: 10 * hourlyRate,
      milestone: `Milestone ${pricingItems.length + 1}`,
      order_index: pricingItems.length,
    };
    setPricingItems([...pricingItems, newItem]);
  };

  const handleRemovePricingItem = (index: number) => {
    setPricingItems(pricingItems.filter((_, i) => i !== index));
  };

  if (isLoading || !proposal) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
      </div>
    );
  }

  const calculatedTotal = pricingItems.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Action Header */}
      <div className="warm-glass-card border border-[#e6dbc9] p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-16 z-30 shadow-sm">
        <div className="space-y-1 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-serif-title text-2xl font-normal text-[#2c221e] bg-transparent border-b border-transparent hover:border-[#e3d7c5] focus:border-[#4a382a] focus:outline-none w-full"
          />
          <div className="flex items-center gap-3 text-xs text-[#6e5d53]">
            <input
              type="text"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="Project Type"
              className="bg-transparent border-b border-transparent hover:border-[#e3d7c5] focus:border-[#4a382a] focus:outline-none"
            />
            <span>•</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#fcfbf8] border border-[#e3d7c5] text-xs font-bold rounded-lg px-2 py-1 text-[#2c221e]"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="changes_requested">Changes Requested</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => {
              setActiveTab('versions');
              fetchVersions();
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#eee6da] hover:bg-[#e4dacb] text-[#4a382a] border border-[#e2d6c3] flex items-center gap-1.5 transition-colors"
          >
            <History className="h-4 w-4" />
            <span>Versions</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#eef5eb] border border-[#cbe3c5] text-[#2e6b22] hover:bg-[#e1f0dc] flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>PDF Export</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f1eae0] border border-[#e3d7c5] text-[#4a382a] hover:bg-[#e8decb] flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Link</span>
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4a382a] hover:bg-[#382a1e] text-white flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saveMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Navigation Tabs */}
      <div className="flex border-b border-[#e6dbc9] space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('content')}
          className={`pb-3 transition-colors ${
            activeTab === 'content' ? 'text-[#4a382a] border-b-2 border-[#4a382a]' : 'text-[#6e5d53] hover:text-[#2c221e]'
          }`}
        >
          Proposal Content ({sections.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 transition-colors ${
            activeTab === 'pricing' ? 'text-[#4a382a] border-b-2 border-[#4a382a]' : 'text-[#6e5d53] hover:text-[#2c221e]'
          }`}
        >
          Pricing & Milestones (${calculatedTotal.toLocaleString()})
        </button>
        <button
          onClick={() => {
            setActiveTab('versions');
            fetchVersions();
          }}
          className={`pb-3 transition-colors ${
            activeTab === 'versions' ? 'text-[#4a382a] border-b-2 border-[#4a382a]' : 'text-[#6e5d53] hover:text-[#2c221e]'
          }`}
        >
          Version History
        </button>
      </div>

      {/* TAB 1: SECTION EDITOR */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#6e5d53]">Reorder, edit titles, or format section content below.</p>
            <button
              onClick={handleAddSection}
              className="text-xs font-bold text-[#4a382a] hover:text-[#945f32] flex items-center gap-1 bg-[#eee6da] border border-[#e2d6c3] px-3 py-1.5 rounded-xl shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Section
            </button>
          </div>

          <div className="space-y-6">
            {sections.map((sec, idx) => (
              <div key={idx} className="warm-glass-card border border-[#e6dbc9] p-6 rounded-3xl space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[idx].title = e.target.value;
                      setSections(updated);
                    }}
                    className="font-bold text-[#2c221e] text-lg bg-transparent border-b border-transparent hover:border-[#e3d7c5] focus:border-[#4a382a] focus:outline-none w-full"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveSection(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#6e5d53] hover:text-[#2c221e] disabled:opacity-30"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-[#6e5d53] hover:text-[#2c221e] disabled:opacity-30"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSection(idx)}
                      className="p-1 text-[#6e5d53] hover:text-[#a82525] ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={sec.content}
                  onChange={(e) => {
                    const updated = [...sections];
                    updated[idx].content = e.target.value;
                    setSections(updated);
                  }}
                  className="w-full p-4 bg-[#fcfbf8] border border-[#e3d7c5] rounded-2xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 font-sans resize-y shadow-inner leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRICING ENGINE */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#6e5d53]">Modify milestone pricing, hours, and rates.</p>
            <button
              onClick={handleAddPricingItem}
              className="text-xs font-bold text-[#4a382a] hover:text-[#945f32] flex items-center gap-1 bg-[#eee6da] border border-[#e2d6c3] px-3 py-1.5 rounded-xl shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Add Milestone Item
            </button>
          </div>

          <div className="warm-glass-card border border-[#e6dbc9] rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm text-[#2c221e]">
              <thead className="bg-[#f5efe6] text-xs uppercase text-[#6e5d53] border-b border-[#e6dbc9] font-bold">
                <tr>
                  <th className="p-4">Milestone Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 w-24 text-center">Hours</th>
                  <th className="p-4 w-28 text-center">Rate ($)</th>
                  <th className="p-4 w-32 text-right">Amount ($)</th>
                  <th className="p-4 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6dbc9] bg-[#fcfbf8]">
                {pricingItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f5efe6]">
                    <td className="p-4">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...pricingItems];
                          updated[idx].title = e.target.value;
                          setPricingItems(updated);
                        }}
                        className="bg-[#f5efe6] border border-[#e3d7c5] px-3 py-1.5 rounded-lg text-[#2c221e] font-bold text-sm w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => {
                          const updated = [...pricingItems];
                          updated[idx].description = e.target.value;
                          setPricingItems(updated);
                        }}
                        className="bg-[#f5efe6] border border-[#e3d7c5] px-3 py-1.5 rounded-lg text-[#6e5d53] text-xs w-full"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.hours}
                        onChange={(e) => {
                          const updated = [...pricingItems];
                          const hrs = parseFloat(e.target.value) || 0;
                          updated[idx].hours = hrs;
                          updated[idx].amount = hrs * updated[idx].rate;
                          setPricingItems(updated);
                        }}
                        className="bg-[#f5efe6] border border-[#e3d7c5] px-3 py-1.5 rounded-lg text-[#2c221e] text-xs w-full text-center font-bold"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => {
                          const updated = [...pricingItems];
                          const r = parseFloat(e.target.value) || 0;
                          updated[idx].rate = r;
                          updated[idx].amount = updated[idx].hours * r;
                          setPricingItems(updated);
                        }}
                        className="bg-[#f5efe6] border border-[#e3d7c5] px-3 py-1.5 rounded-lg text-[#2c221e] text-xs w-full text-center font-bold"
                      />
                    </td>
                    <td className="p-4 text-right font-extrabold text-[#2e6b22]">
                      ${item.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleRemovePricingItem(idx)} className="text-[#8c7b6f] hover:text-[#a82525]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f5efe6] border-t border-[#e6dbc9] font-bold">
                <tr>
                  <td colSpan={4} className="p-4 text-[#2c221e]">Total Investment Summary:</td>
                  <td className="p-4 text-right text-[#2e6b22] text-lg">${calculatedTotal.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VERSIONS HISTORY */}
      {activeTab === 'versions' && (
        <div className="warm-glass-card border border-[#e6dbc9] rounded-3xl p-6 space-y-4">
          <h3 className="font-serif-title text-xl font-normal text-[#2c221e]">Proposal Revision History</h3>
          {versions.length > 0 ? (
            <div className="space-y-3">
              {versions.map((ver) => (
                <div key={ver.id} className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#4a382a]">Version #{ver.version_number}</span>
                    <p className="text-xs text-[#6e5d53]">Saved on {new Date(ver.created_at).toLocaleString()}</p>
                  </div>
                  <span className="text-xs text-[#2c221e] font-semibold">
                    {ver.data.sections?.length || 0} Sections • ${ver.data.total_price?.toLocaleString() || 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6e5d53]">Click "Save Changes" to record version snapshots.</p>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c221e]/40 backdrop-blur-md animate-fade-in">
          <div className="warm-glass-card bg-[#faf7f2] border border-[#e6dbc9] rounded-3xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h3 className="font-serif-title text-xl font-bold text-[#2c221e]">Share Proposal with Client</h3>
            <p className="text-xs text-[#6e5d53]">Send this unique link to your client for online viewing, PDF download, and acceptance.</p>

            <div className="bg-[#fcfbf8] border border-[#e3d7c5] p-3 rounded-2xl flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-[#2c221e] truncate">
                {window.location.origin}/p/{proposal.token}
              </span>
              <button
                onClick={handleCopyShareLink}
                className="px-3 py-1.5 bg-[#4a382a] hover:bg-[#382a1e] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-[#eee6da] text-[#4a382a] rounded-xl text-xs font-bold hover:bg-[#e4dacb] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
