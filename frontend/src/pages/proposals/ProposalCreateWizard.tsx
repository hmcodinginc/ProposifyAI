import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Client, FeatureItem, RequirementAnalysisResponse, ProposalGenerationResponse } from '../../types';
import { Wand2, Sparkles, ArrowRight, ArrowLeft, Plus, Trash2, HelpCircle, Clock, Save } from 'lucide-react';

export const ProposalCreateWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Step 1 State
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(85.0);
  const [rawRequirements, setRawRequirements] = useState('');

  // Step 2 State (AI Analysis Result)
  const [analysis, setAnalysis] = useState<RequirementAnalysisResponse | null>(null);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 4 State (Generated Proposal)
  const [generation, setGeneration] = useState<ProposalGenerationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch clients for dropdown
  const { data: clients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await api.get('/clients');
      return res.data;
    },
  });

  // Step 1 -> 2: Run AI Requirement Analyzer
  const handleRunAnalysis = async () => {
    if (!rawRequirements.trim() || !title.trim()) return;
    setIsAnalyzing(true);
    try {
      const selectedClient = clients?.find((c) => c.id === clientId);
      const res = await api.post('/ai/analyze', {
        raw_requirements: rawRequirements,
        client_name: selectedClient?.name,
        client_industry: selectedClient?.company,
      });
      setAnalysis(res.data);
      setFeatures(res.data.extracted_features);
      if (res.data.suggested_hourly_rate) {
        setHourlyRate(res.data.suggested_hourly_rate);
      }
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2 -> Step 3: Confirm Scope
  const handleConfirmScope = () => {
    setStep(3);
  };

  // Step 3 -> Step 4: Run AI Proposal Generator
  const handleGenerateProposal = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/ai/generate', {
        title,
        client_id: clientId || undefined,
        project_type: analysis?.project_type || 'Custom Project',
        raw_requirements: rawRequirements,
        extracted_features: features,
        answers,
        hourly_rate: hourlyRate,
      });
      setGeneration(res.data);
      setStep(4);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 4 -> Save & Save Proposal to DB
  const handleSaveAndEdit = async () => {
    if (!generation) return;
    try {
      const res = await api.post('/proposals', {
        title: generation.title,
        client_id: clientId || undefined,
        project_type: generation.project_type,
        status: 'draft',
        total_price: generation.total_price,
        currency: 'USD',
        estimated_duration_days: generation.estimated_duration_days,
        hourly_rate: generation.hourly_rate,
        sections: generation.sections,
        pricing_items: generation.pricing_items,
      });
      navigate(`/proposals/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Wizard Header & Progress Bar */}
      <div className="warm-glass-card border border-[#e6dbc9] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-[#4a382a]" />
            <h1 className="font-serif-title text-3xl font-normal text-[#2c221e] tracking-tight">AI Proposal Generator</h1>
          </div>
          <p className="text-xs text-[#6e5d53]">Convert raw client notes into a structured, high-converting business proposal.</p>
          <span className="mt-3 px-3.5 py-1 bg-[#f1eae0] border border-[#e3d7c5] text-[#4a382a] text-xs font-bold rounded-full">
            Step {step} of 4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, name: 'Requirements' },
            { num: 2, name: 'Analysis & Risk' },
            { num: 3, name: 'Scope & Pricing' },
            { num: 4, name: 'Generated Document' },
          ].map((item) => (
            <div key={item.num} className="space-y-1 text-center">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= item.num ? 'bg-[#4a382a]' : 'bg-[#eee6da]'
                }`}
              />
              <span className={`text-[11px] font-bold block truncate ${step >= item.num ? 'text-[#2c221e]' : 'text-[#8c7b6f]'}`}>
                {item.num}. {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: INPUT REQUIREMENTS */}
      {step === 1 && (
        <div className="warm-glass-card border border-[#e6dbc9] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <h2 className="font-serif-title text-2xl font-normal text-[#2c221e]">Project Details & Client Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1.5">
                Proposal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. E-Commerce Platform Development"
                className="w-full px-4 py-3 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] placeholder-[#8c7b6f] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1.5">
                Select Client (Optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-3 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
              >
                <option value="">-- No Client Selected --</option>
                {clients?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1.5">
              Hourly Billing Rate ($/hr)
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="w-full md:w-1/2 px-4 py-3 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1.5">
              Raw Client Requirements & Notes *
            </label>
            <textarea
              rows={6}
              required
              value={rawRequirements}
              onChange={(e) => setRawRequirements(e.target.value)}
              placeholder="Paste email transcripts, client briefs, or notes here... e.g. Client needs a mobile app with user profiles, push notifications, Stripe payment integration, admin dashboard, and cloud deployment."
              className="w-full p-4 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] placeholder-[#8c7b6f] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 resize-none shadow-inner"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !rawRequirements.trim() || !title.trim()}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing Requirements with AI...' : (
                <>
                  <span>Analyze Requirements</span>
                  <Wand2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI REQUIREMENT ANALYSIS & CLARIFICATIONS */}
      {step === 2 && analysis && (
        <div className="warm-glass-card border border-[#e6dbc9] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="bg-[#eee6da]/60 border border-[#e3d7c5] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#945f32]">Detected Project Classification</span>
              <h3 className="font-serif-title text-2xl font-normal text-[#2c221e] mt-0.5">{analysis.project_type}</h3>
            </div>
            <span className="px-3.5 py-1.5 bg-[#e2f0d9] text-[#2e6b22] border border-[#cbe3c5] text-xs font-bold rounded-xl">
              AI Analysis Complete
            </span>
          </div>

          {/* Extracted Features List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-[#2c221e]">Extracted Project Features</h3>
              <button
                onClick={() =>
                  setFeatures([
                    ...features,
                    { title: 'Custom Module', description: 'Custom client module feature.', complexity: 'medium', estimated_hours: 20 },
                  ])
                }
                className="text-xs text-[#945f32] hover:text-[#4a382a] font-bold flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx].title = e.target.value;
                        setFeatures(updated);
                      }}
                      className="font-bold text-[#2c221e] bg-transparent border-b border-transparent hover:border-[#e3d7c5] focus:border-[#4a382a] text-sm focus:outline-none w-full"
                    />
                    <input
                      type="text"
                      value={feat.description}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx].description = e.target.value;
                        setFeatures(updated);
                      }}
                      className="text-xs text-[#6e5d53] bg-transparent border-b border-transparent hover:border-[#e3d7c5] focus:border-[#4a382a] focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#2c221e] bg-[#f5efe6] px-3 py-1.5 rounded-xl border border-[#e6dbc9]">
                      <Clock className="h-3.5 w-3.5 text-[#945f32]" />
                      <input
                        type="number"
                        value={feat.estimated_hours}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx].estimated_hours = parseFloat(e.target.value) || 0;
                          setFeatures(updated);
                        }}
                        className="w-12 bg-transparent text-right font-bold text-[#2c221e] focus:outline-none"
                      />
                      <span>hrs</span>
                    </div>
                    <button
                      onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                      className="text-[#8c7b6f] hover:text-[#a82525] p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Information Clarifying Questions */}
          {analysis.missing_information && analysis.missing_information.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#e6dbc9]">
              <h3 className="text-md font-bold text-[#2c221e] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#a86523]" />
                Missing Information & Clarifying Questions
              </h3>

              <div className="space-y-4">
                {analysis.missing_information.map((item, idx) => (
                  <div key={idx} className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#a86523]">{item.category}</span>
                      <span className="text-[11px] text-[#8c7b6f]">{item.reason}</span>
                    </div>
                    <p className="text-xs text-[#2c221e] font-medium">{item.question}</p>
                    <input
                      type="text"
                      value={answers[item.question] || ''}
                      onChange={(e) => setAnswers({ ...answers, [item.question]: e.target.value })}
                      placeholder="Type answer or preference here..."
                      className="w-full px-3 py-2 bg-[#f5efe6] border border-[#e6dbc9] rounded-xl text-xs text-[#2c221e] focus:outline-none focus:ring-1 focus:ring-[#4a382a]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e5d53] hover:bg-[#eee6da] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleConfirmScope}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white transition-all shadow-sm"
            >
              <span>Calculate Scope & Pricing</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SCOPE & PRICING ENGINE CALCULATIONS */}
      {step === 3 && (
        <div className="warm-glass-card border border-[#e6dbc9] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <h2 className="font-serif-title text-2xl font-normal text-[#2c221e]">Pricing & Timeline Calculation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl text-center">
              <span className="text-xs text-[#6e5d53] uppercase font-semibold">Total Development Hours</span>
              <p className="text-2xl font-extrabold text-[#2c221e] mt-1">
                {features.reduce((acc, f) => acc + f.estimated_hours, 0)} hrs
              </p>
            </div>

            <div className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl text-center">
              <span className="text-xs text-[#6e5d53] uppercase font-semibold">Hourly Rate</span>
              <p className="text-2xl font-extrabold text-[#4a382a] mt-1">${hourlyRate}/hr</p>
            </div>

            <div className="bg-[#eef5eb] border border-[#cbe3c5] p-4 rounded-2xl text-center">
              <span className="text-xs text-[#2e6b22] uppercase font-semibold">Calculated Total Investment</span>
              <p className="text-2xl font-extrabold text-[#2e6b22] mt-1">
                ${(features.reduce((acc, f) => acc + f.estimated_hours, 0) * hourlyRate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-md font-bold text-[#2c221e]">Milestone Phase Distribution</h3>
            <div className="bg-[#fcfbf8] border border-[#e6dbc9] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-[#2c221e]">
                <thead className="bg-[#f5efe6] text-[#6e5d53] border-b border-[#e6dbc9] uppercase font-bold">
                  <tr>
                    <th className="p-3.5">Phase Title</th>
                    <th className="p-3.5">Milestone</th>
                    <th className="p-3.5 text-center">Hours</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6dbc9]">
                  {features.map((f, i) => (
                    <tr key={i} className="hover:bg-[#f5efe6]">
                      <td className="p-3.5 font-bold text-[#2c221e]">{f.title}</td>
                      <td className="p-3.5 text-[#6e5d53]">Milestone {i + 1}</td>
                      <td className="p-3.5 text-center font-bold">{f.estimated_hours} hrs</td>
                      <td className="p-3.5 text-right font-bold text-[#2e6b22]">${(f.estimated_hours * hourlyRate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#e6dbc9]">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e5d53] hover:bg-[#eee6da] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleGenerateProposal}
              disabled={isGenerating}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isGenerating ? 'Synthesizing Proposal with AI...' : (
                <>
                  <span>Generate Complete Proposal Document</span>
                  <Wand2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: GENERATED PROPOSAL PREVIEW */}
      {step === 4 && generation && (
        <div className="warm-glass-card border border-[#e6dbc9] p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-col items-center justify-center border-b border-[#e6dbc9] pb-4">
            <span className="text-xs font-bold text-[#2e6b22] uppercase tracking-wider">AI Generation Successful</span>
            <h2 className="font-serif-title text-2xl font-normal text-[#2c221e] mt-0.5">{generation.title}</h2>
            <button
              onClick={handleSaveAndEdit}
              className="mt-4 flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-md transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save & Open Proposal Editor</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 bg-[#fcfbf8] p-6 rounded-2xl border border-[#e6dbc9]">
            {generation.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2 border-b border-[#e6dbc9] pb-4 last:border-none">
                <h3 className="text-md font-bold text-[#4a382a]">{sec.title}</h3>
                <div className="text-xs text-[#52443a] whitespace-pre-wrap leading-relaxed">{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
