import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Client, FeatureItem, RequirementAnalysisResponse, ProposalGenerationResponse } from '../../types';
import { Wand2, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Plus, Trash2, HelpCircle, DollarSign, Clock, Layers, Save } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Wizard Header & Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight text-center">AI Proposal Generator</h1>
          </div>
          <p className="text-xs text-slate-400 text-center">Convert raw client notes into a structured, high-converting business proposal.</p>
          <span className="mt-3 px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-full">
            Step {step} of 4
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { num: 1, name: 'Requirements' },
            { num: 2, name: 'Analysis & Questions' },
            { num: 3, name: 'Scope & Pricing' },
            { num: 4, name: 'Generated Document' },
          ].map((item) => (
            <div key={item.num} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= item.num ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-slate-800'
                }`}
              />
              <span className={`text-[11px] font-semibold block truncate text-center ${step >= item.num ? 'text-blue-400' : 'text-slate-500'}`}>
                {item.num}. {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: INPUT REQUIREMENTS */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5 text-center">
          <h2 className="text-lg font-bold text-white text-center">Project Details & Client Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                Proposal Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. E-Commerce Platform Development"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
                Select Client (Optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
              Hourly Billing Rate ($/hr)
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="w-full md:w-1/2 mx-auto px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 text-center">
              Raw Client Requirements & Notes *
            </label>
            <textarea
              rows={6}
              required
              value={rawRequirements}
              onChange={(e) => setRawRequirements(e.target.value)}
              placeholder="Paste email transcripts, client briefs, or notes here... e.g. Client needs a mobile app with user profiles, push notifications, Stripe payment integration, admin dashboard, and cloud deployment."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-center"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing || !rawRequirements.trim() || !title.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
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
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
          <div className="bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 text-center">Detected Project Classification</span>
            <h3 className="text-xl font-extrabold text-white mt-0.5 text-center">{analysis.project_type}</h3>
            <span className="mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">
              AI Analysis Complete
            </span>
          </div>

          {/* Extracted Features List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-white text-center flex-1">Extracted Project Features</h3>
              <button
                onClick={() =>
                  setFeatures([
                    ...features,
                    { title: 'Custom Module', description: 'Custom client module feature.', complexity: 'medium', estimated_hours: 20 },
                  ])
                }
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feat, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-center">
                  <div className="space-y-1 flex-1 text-center">
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx].title = e.target.value;
                        setFeatures(updated);
                      }}
                      className="font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-sm focus:outline-none w-full text-center"
                    />
                    <input
                      type="text"
                      value={feat.description}
                      onChange={(e) => {
                        const updated = [...features];
                        updated[idx].description = e.target.value;
                        setFeatures(updated);
                      }}
                      className="text-xs text-slate-400 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 focus:outline-none w-full text-center"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      <input
                        type="number"
                        value={feat.estimated_hours}
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx].estimated_hours = parseFloat(e.target.value) || 0;
                          setFeatures(updated);
                        }}
                        className="w-12 bg-transparent text-right font-bold text-white focus:outline-none text-center"
                      />
                      <span>hrs</span>
                    </div>
                    <button
                      onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 p-1"
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
            <div className="space-y-3 pt-4 border-t border-slate-800 text-center">
              <h3 className="text-md font-bold text-white flex items-center justify-center gap-2 text-center">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                Missing Information & Clarifying Questions
              </h3>

              <div className="space-y-4">
                {analysis.missing_information.map((item, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-center">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400">{item.category}</span>
                      <span className="text-[11px] text-slate-500">{item.reason}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium text-center">{item.question}</p>
                    <input
                      type="text"
                      value={answers[item.question] || ''}
                      onChange={(e) => setAnswers({ ...answers, [item.question]: e.target.value })}
                      placeholder="Type answer or preference here..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleConfirmScope}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-all"
            >
              <span>Calculate Scope & Pricing</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SCOPE & PRICING ENGINE CALCULATIONS */}
      {step === 3 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
          <h2 className="text-lg font-bold text-white text-center">Pricing & Timeline Calculation</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Development Hours</span>
              <p className="text-2xl font-extrabold text-white mt-1 text-center">
                {features.reduce((acc, f) => acc + f.estimated_hours, 0)} hrs
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Hourly Rate</span>
              <p className="text-2xl font-extrabold text-blue-400 mt-1 text-center">${hourlyRate}/hr</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 uppercase font-semibold">Calculated Total Investment</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1 text-center">
                ${(features.reduce((acc, f) => acc + f.estimated_hours, 0) * hourlyRate).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-md font-bold text-white text-center">Milestone Phase Distribution</h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 uppercase">
                  <tr>
                    <th className="p-3 text-center">Phase Title</th>
                    <th className="p-3 text-center">Milestone</th>
                    <th className="p-3 text-center">Hours</th>
                    <th className="p-3 text-center">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {features.map((f, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-white text-center">{f.title}</td>
                      <td className="p-3 text-slate-400 text-center">Milestone {i + 1}</td>
                      <td className="p-3 text-center font-bold">{f.estimated_hours} hrs</td>
                      <td className="p-3 text-center font-bold text-emerald-400">${(f.estimated_hours * hourlyRate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleGenerateProposal}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
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
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6 text-center">
          <div className="flex flex-col items-center justify-center border-b border-slate-800 pb-4 text-center">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider text-center">AI Generation Successful</span>
            <h2 className="text-2xl font-bold text-white mt-0.5 text-center">{generation.title}</h2>
            <button
              onClick={handleSaveAndEdit}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save & Open Proposal Editor</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
            {generation.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-800/60 pb-4 last:border-none text-center">
                <h3 className="text-md font-bold text-blue-400 text-center">{sec.title}</h3>
                <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed text-center">{sec.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
