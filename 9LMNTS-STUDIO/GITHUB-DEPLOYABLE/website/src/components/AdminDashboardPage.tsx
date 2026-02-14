import { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, Mail, Phone, CheckCircle, AlertCircle, FileText, MessageSquare, TrendingUp, Clock, Filter, User } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  project_type: string;
  timeline: string;
  status: 'pending' | 'deposit_paid' | 'contract_signed' | 'in_progress' | 'completed';
  deposit_paid: boolean;
  contract_signed: boolean;
  invoice_sent: boolean;
  created_at: string;
  estimated_value: number;
  qualification_score: number;
}

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      // Fetch from localStorage for demo
      const localClients = JSON.parse(localStorage.getItem('project_submissions') || '[]');
      
      // Try to fetch from Supabase
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('project_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setClients(data);
        } else {
          setClients(localClients);
        }
      } catch (supabaseError) {
        setClients(localClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, newStatus: Client['status']) => {
    try {
      // Update in localStorage
      const updatedClients = clients.map(client => 
        client.id === clientId ? { ...client, status: newStatus } : client
      );
      setClients(updatedClients);
      localStorage.setItem('project_submissions', JSON.stringify(updatedClients));

      // Update in Supabase
      try {
        const supabase = getSupabaseClient();
        // @ts-ignore
        const { error } = await (supabase.rpc('update_project_status', {
          p_id: clientId,
          p_status: newStatus
        }) as any);
        
        if (error) {
          console.error('Supabase update error:', error);
        }

        // Send notification via N8n
        await fetch('https://n8n.your-domain.com/webhook/status-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            newStatus,
            timestamp: new Date().toISOString()
          })
        });

        console.log(`✅ Client ${clientId} status updated to ${newStatus}`);
      } catch (error) {
        console.log('⚠️ Status update failed:', error);
      }
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };

  const sendClientMessage = async (client: Client, message: string) => {
    try {
      // Send via N8n workflow
      await fetch('https://n8n.your-domain.com/webhook/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: client.email,
          name: client.name,
          message,
          type: 'admin_message'
        })
      });
      console.log('✅ Message sent to client');
    } catch (error) {
      console.log('⚠️ Message failed:', error);
    }
  };

  const generateInvoice = async (client: Client) => {
    try {
      await fetch('https://n8n.your-domain.com/webhook/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          amount: client.estimated_value,
          depositAmount: client.estimated_value * 0.5,
          clientName: client.name,
          clientEmail: client.email
        })
      });
      console.log('✅ Invoice generated for client');
    } catch (error) {
      console.log('⚠️ Invoice generation failed:', error);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesFilter = filter === 'all' || client.status === filter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: clients.length,
    pending: clients.filter(c => c.status === 'pending').length,
    depositPaid: clients.filter(c => c.status === 'deposit_paid').length,
    inProgress: clients.filter(c => c.status === 'in_progress').length,
    completed: clients.filter(c => c.status === 'completed').length,
    totalValue: clients.reduce((sum, c) => sum + (c.estimated_value || 0), 0),
    avgQualification: clients.reduce((sum, c) => sum + (c.qualification_score || 0), 0) / clients.length || 0
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-16">
      {/* Header */}
      <div className="bg-[#222222] border-b border-[#FF7A00]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl text-white font-bold">Admin Dashboard</h1>
              <span className="px-3 py-1 bg-[#FF7A00] text-[#1A1A1A] rounded-full text-sm">
                9LMNTS Studio
              </span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-[#FF7A00] text-[#1A1A1A] rounded-lg hover:bg-[#FF7A00]/90 transition-all"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="text-[#FF7A00]" size={24} />
              <span className="text-gray-400 text-sm">Total</span>
            </div>
            <div className="text-3xl text-white font-bold">{stats.total}</div>
            <div className="text-gray-400 text-sm">All Clients</div>
          </div>

          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="text-yellow-500" size={24} />
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
            <div className="text-3xl text-yellow-500 font-bold">{stats.pending}</div>
            <div className="text-gray-400 text-sm">Awaiting Action</div>
          </div>

          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-green-500" size={24} />
              <span className="text-gray-400 text-sm">Deposits</span>
            </div>
            <div className="text-3xl text-green-500 font-bold">{stats.depositPaid}</div>
            <div className="text-gray-400 text-sm">50% Paid</div>
          </div>

          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-blue-500" size={24} />
              <span className="text-gray-400 text-sm">In Progress</span>
            </div>
            <div className="text-3xl text-blue-500 font-bold">{stats.inProgress}</div>
            <div className="text-gray-400 text-sm">Active Projects</div>
          </div>

          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="text-purple-500" size={24} />
              <span className="text-gray-400 text-sm">Completed</span>
            </div>
            <div className="text-3xl text-purple-500 font-bold">{stats.completed}</div>
            <div className="text-gray-400 text-sm">Finished</div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-[#FF7A00]" size={24} />
              <span className="text-gray-400 text-sm">Total Pipeline Value</span>
            </div>
            <div className="text-3xl text-[#FF7A00] font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Potential Revenue</div>
          </div>

          <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <span className="text-gray-400 text-sm">Avg Qualification</span>
            </div>
            <div className="text-3xl text-green-500 font-bold">
              {stats.avgQualification.toFixed(1)}%
            </div>
            <div className="text-gray-400 text-sm">Lead Quality</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-white mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
              >
                <option value="all">All Clients</option>
                <option value="pending">Pending</option>
                <option value="deposit_paid">Deposit Paid</option>
                <option value="contract_signed">Contract Signed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-white mb-2">Search Clients</label>
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or company..."
                  className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white placeholder-gray-400 focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-[#222222] border border-[#FF7A00]/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1A1A1A] border-b border-[#FF7A00]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Qualification</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FF7A00]/20">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-white font-medium">{client.name}</div>
                        <div className="text-gray-400 text-sm">{client.email}</div>
                        {client.company && (
                          <div className="text-gray-500 text-xs">{client.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">{client.plan}</div>
                      <div className="text-gray-400 text-sm">{client.project_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        client.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        client.status === 'deposit_paid' ? 'bg-green-500/20 text-green-500' :
                        client.status === 'contract_signed' ? 'bg-blue-500/20 text-blue-500' :
                        client.status === 'in_progress' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {client.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[#FF7A00] font-bold">
                        ${client.estimated_value?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white">
                        {client.qualification_score}% 
                        <div className="text-gray-400 text-xs">
                          {client.qualification_score >= 80 ? 'High' :
                           client.qualification_score >= 60 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-2 bg-[#FF7A00] text-[#1A1A1A] rounded hover:bg-[#FF7A00]/90 transition-all"
                          title="View Details"
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => generateInvoice(client)}
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                          title="Generate Invoice"
                        >
                          <DollarSign size={16} />
                        </button>
                        <button
                          onClick={() => sendClientMessage(client, 'Status update on your project')}
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                          title="Send Message"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Details Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#222222] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-white font-bold">Client Details</h2>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="text-[#FF7A00]" size={20} />
                        <div>
                          <div className="text-white">{selectedClient.name}</div>
                          <div className="text-gray-400 text-sm">{selectedClient.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-[#FF7A00]" size={20} />
                        <div className="text-white">{selectedClient.email}</div>
                      </div>
                      {selectedClient.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="text-[#FF7A00]" size={20} />
                          <div className="text-white">{selectedClient.phone}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Project Details</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-gray-400 text-sm">Selected Plan</div>
                        <div className="text-[#FF7A00] font-bold">{selectedClient.plan}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Project Type</div>
                        <div className="text-white">{selectedClient.project_type}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Timeline</div>
                        <div className="text-white">{selectedClient.timeline}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Estimated Value</div>
                        <div className="text-[#FF7A00] font-bold text-xl">
                          ${selectedClient.estimated_value?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-4">Status & Actions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Update Status</label>
                      <select
                        value={selectedClient.status}
                        onChange={(e) => updateClientStatus(selectedClient.id, e.target.value as Client['status'])}
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-[#FF7A00]/20 rounded-lg text-white focus:border-[#FF7A00] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="deposit_paid">Deposit Paid</option>
                        <option value="contract_signed">Contract Signed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => generateInvoice(selectedClient)}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        Generate Invoice
                      </button>
                      <button
                        onClick={() => sendClientMessage(selectedClient, 'Project update: Your status has been updated')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Send Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
