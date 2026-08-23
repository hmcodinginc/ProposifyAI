import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { Client, Proposal } from '../../types';
import { Users, Plus, Mail, Phone, Building, Trash2, Edit2, FileText, Search, X } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientHistory, setSelectedClientHistory] = useState<{ client: Client; proposals: Proposal[] } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const { data: clients, isLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const res = await api.get('/clients');
      return res.data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingClient) {
        return api.put(`/clients/${editingClient.id}`, { name, email, company, phone, notes });
      } else {
        return api.post('/clients', { name, email, company, phone, notes });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const openCreateModal = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setCompany(client.company || '');
    setPhone(client.phone || '');
    setNotes(client.notes || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const fetchClientHistory = async (client: Client) => {
    try {
      const res = await api.get(`/clients/${client.id}/proposals`);
      setSelectedClientHistory({ client, proposals: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredClients = clients?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card flex flex-col items-center justify-center text-center gap-4 p-8 rounded-3xl border border-violet-500/20 shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight text-center">Client CRM Management</h1>
          <p className="text-sm text-slate-400 mt-1 text-center">Manage client details, contact information, and proposal history.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 transition-all transform active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, email, or company..."
          className="w-full pl-10 pr-4 py-3 bg-[#090d16] border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm text-center transition-all"
        />
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-violet-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredClients && filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div key={client.id} className="glass-card glass-card-hover rounded-3xl p-6 space-y-4 text-center">
              <div className="flex items-start justify-between">
                <div className="flex-1 text-center">
                  <h3 className="font-bold text-white text-lg text-center">{client.name}</h3>
                  {client.company && (
                    <p className="text-xs text-violet-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                      <Building className="h-3 w-3" />
                      {client.company}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(client)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete client ${client.name}?`)) {
                        deleteMutation.mutate(client.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800/80 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => fetchClientHistory(client)}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Proposal History</span>
                </button>
                <span className="text-[11px] text-slate-500">Added {new Date(client.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-400">
          <Users className="h-10 w-10 mx-auto text-slate-600 mb-3 animate-float" />
          <p className="text-sm font-medium text-center">No clients found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
          >
            Add Your First Client
          </button>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 border border-violet-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white text-center flex-1">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-4 text-center"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                  placeholder="Acme Director"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                  placeholder="contact@acme.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 text-center">Notes / Preferences</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090d16] border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-center"
                  placeholder="Key budget expectations, preferences..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-50 shadow-lg shadow-violet-500/20"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Drawer / Modal */}
      {selectedClientHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-4 border border-violet-500/20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex-1 text-center">
                <h2 className="text-lg font-bold text-white text-center">Proposal History: {selectedClientHistory.client.name}</h2>
                <p className="text-xs text-slate-400 text-center">{selectedClientHistory.client.company || selectedClientHistory.client.email}</p>
              </div>
              <button onClick={() => setSelectedClientHistory(null)} className="text-slate-400 hover:text-white p-1 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedClientHistory.proposals.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {selectedClientHistory.proposals.map((prop) => (
                  <div key={prop.id} className="bg-[#090d16] border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-center">
                    <div className="text-center flex-1">
                      <h4 className="font-semibold text-white text-sm text-center">{prop.title}</h4>
                      <p className="text-xs text-slate-400 text-center">{prop.project_type} • Created {new Date(prop.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-violet-400">${prop.total_price.toLocaleString()}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{prop.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No proposals created for this client yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
