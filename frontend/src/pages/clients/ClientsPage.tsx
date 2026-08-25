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
      <div className="warm-glass-card flex flex-col sm:flex-row items-center justify-between p-8 rounded-3xl border border-[#e6dbc9] shadow-sm gap-6">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#2c221e] tracking-tight">Client Directory</h1>
          <p className="text-sm text-[#6e5d53] mt-1">Manage client details, contact information, and proposal history.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-[#4a382a] hover:bg-[#382a1e] text-white shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c7b6f]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients by name, email, or company..."
          className="w-full pl-10 pr-4 py-3 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-2xl text-[#2c221e] placeholder-[#8c7b6f] focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 text-sm transition-all shadow-inner"
        />
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-[#4a382a] border-t-transparent rounded-full" />
        </div>
      ) : filteredClients && filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div key={client.id} className="warm-glass-card warm-card-hover rounded-3xl p-6 space-y-4 border border-[#e6dbc9]">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif-title font-bold text-[#2c221e] text-xl">{client.name}</h3>
                  {client.company && (
                    <p className="text-xs text-[#945f32] font-semibold flex items-center gap-1 mt-0.5">
                      <Building className="h-3 w-3" />
                      {client.company}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(client)}
                    className="p-1.5 text-[#6e5d53] hover:text-[#2c221e] hover:bg-[#eee6da] rounded-xl transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete client ${client.name}?`)) {
                        deleteMutation.mutate(client.id);
                      }
                    }}
                    className="p-1.5 text-[#6e5d53] hover:text-[#a82525] hover:bg-[#eee6da] rounded-xl transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#52443a] border-t border-b border-[#e6dbc9] py-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#8c7b6f] shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#8c7b6f] shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => fetchClientHistory(client)}
                  className="text-xs font-bold text-[#4a382a] hover:text-[#945f32] flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Proposal History</span>
                </button>
                <span className="text-[11px] text-[#8c7b6f]">Added {new Date(client.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="warm-glass-card rounded-3xl p-12 text-center text-[#6e5d53] border border-[#e6dbc9]">
          <Users className="h-10 w-10 mx-auto text-[#bfae97] mb-3" />
          <p className="text-sm font-medium">No clients found.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-5 py-2.5 bg-[#4a382a] text-white rounded-xl text-xs font-bold hover:bg-[#382a1e] transition-colors shadow-sm"
          >
            Add Your First Client
          </button>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c221e]/40 backdrop-blur-md animate-fade-in">
          <div className="warm-glass-card bg-[#faf7f2] rounded-3xl w-full max-w-md p-6 shadow-xl space-y-5 border border-[#e6dbc9]">
            <div className="flex items-center justify-between border-b border-[#e6dbc9] pb-4">
              <h2 className="font-serif-title text-xl font-bold text-[#2c221e]">{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={closeModal} className="text-[#6e5d53] hover:text-[#2c221e] p-1 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
                  placeholder="Client Contact Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
                  placeholder="contact@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6e5d53] uppercase tracking-wider mb-1">Notes / Preferences</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#fcfbf8] border border-[#e3d7c5] focus:border-[#4a382a] rounded-xl text-[#2c221e] text-sm focus:outline-none focus:ring-2 focus:ring-[#4a382a]/20 resize-none"
                  placeholder="Key budget expectations, preferences..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6e5d53] hover:bg-[#eee6da] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#4a382a] hover:bg-[#382a1e] text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedClientHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2c221e]/40 backdrop-blur-md animate-fade-in">
          <div className="warm-glass-card bg-[#faf7f2] rounded-3xl w-full max-w-2xl p-6 shadow-xl space-y-4 border border-[#e6dbc9]">
            <div className="flex items-center justify-between border-b border-[#e6dbc9] pb-4">
              <div>
                <h2 className="font-serif-title text-xl font-bold text-[#2c221e]">Proposal History: {selectedClientHistory.client.name}</h2>
                <p className="text-xs text-[#6e5d53]">{selectedClientHistory.client.company || selectedClientHistory.client.email}</p>
              </div>
              <button onClick={() => setSelectedClientHistory(null)} className="text-[#6e5d53] hover:text-[#2c221e] p-1 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedClientHistory.proposals.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {selectedClientHistory.proposals.map((prop) => (
                  <div key={prop.id} className="bg-[#fcfbf8] border border-[#e6dbc9] p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#2c221e] text-sm">{prop.title}</h4>
                      <p className="text-xs text-[#6e5d53]">{prop.project_type} • Created {new Date(prop.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#4a382a]">${prop.total_price.toLocaleString()}</p>
                      <span className="text-[10px] uppercase font-bold text-[#8c7b6f]">{prop.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6e5d53] py-6 text-center">No proposals created for this client yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
