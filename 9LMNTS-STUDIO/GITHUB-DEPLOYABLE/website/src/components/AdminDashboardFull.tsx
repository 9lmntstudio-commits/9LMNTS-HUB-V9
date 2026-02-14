import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Settings, 
  Search, 
  Bell, 
  Layers, 
  Plus,
  X,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  RefreshCw,
  Check,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Filter,
  Eye,
  MoreVertical
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getSupabaseClient } from '../utils/supabase/client';

interface AdminDashboardFullProps {
  onNavigate: (page: string) => void;
  user: { id: string; email: string; name: string; role: string };
  accessToken: string | null;
  onLogout: () => void;
}

interface Project {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'pending' | 'completed' | 'cancelled';
  budget: number;
  revenue: number;
  client: string;
  clientId?: string;
  createdAt: string;
  service?: string; // Nine Pillars AI service
  features?: string[]; // AI service features
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: string;
  project_type: string;
  timeline: string;
  status: string;
  estimated_value: number;
  qualification_score: number;
  created_at: string;
  location?: string;
  revenue?: number;
  nextMeeting?: string;
  notes?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
}

export function AdminDashboardFull({ onNavigate, user, accessToken, onLogout }: AdminDashboardFullProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'clients' | 'users' | 'settings'>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Store subscription refs for cleanup
  const subscriptionRefs = useRef<any[]>([]);

  // New Project Form
  const [newProject, setNewProject] = useState({
    name: '',
    type: '',
    client: '',
    clientId: '',
    budget: '',
    status: 'pending' as const
  });

  // New Client Form
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    status: 'prospect' as const,
    nextMeeting: '',
    notes: ''
  });

  // New User Form
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    role: 'user'
  });

  // Fetch data on mount or when view changes
  useEffect(() => {
    if (activeView === 'projects') {
      fetchProjects();
    } else if (activeView === 'clients') {
      fetchClients();
    } else if (activeView === 'users') {
      fetchUsers();
    } else if (activeView === 'dashboard') {
      fetchProjects();
      fetchClients();
    }
  }, [activeView]);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      // Clean up all subscriptions
      subscriptionRefs.current.forEach(sub => {
        if (sub && sub.unsubscribe) {
          sub.unsubscribe();
        }
      });
      subscriptionRefs.current = [];
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      // Use mock data for now since Supabase function doesn't exist
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'AI Brand Voice Development',
          type: 'AI Service',
          status: 'active',
          budget: 2500,
          revenue: 2500,
          client: 'Tech Startup Inc',
          createdAt: '2024-01-15',
          service: 'AI Brand Voice',
          features: ['Custom GPT Training', 'Automated Content', 'Brand Voice AI']
        },
        {
          id: '2',
          name: 'AI Visual Design System',
          type: 'AI Service',
          status: 'pending',
          budget: 2000,
          revenue: 0,
          client: 'Creative Agency',
          createdAt: '2024-01-20',
          service: 'AI Visual Design',
          features: ['AI Logo Generation', 'Brand Identity', 'Visual Consistency']
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProjects(mockProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Try Supabase first for real-time data
      const supabase = getSupabaseClient();
      
      // Fetch AI Projects
      const { data: aiProjects, error: aiError } = await supabase
        .from('ai_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Fetch Creative Projects  
      const { data: creativeProjects, error: creativeError } = await supabase
        .from('creative_projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (aiError || creativeError) {
        console.error('Supabase error:', aiError || creativeError);
        console.log('🔄 Falling back to localStorage...');
        
        // Fallback to localStorage if database fails
        const localAI = JSON.parse(localStorage.getItem('ai_project_submissions') || '[]');
        const localCreative = JSON.parse(localStorage.getItem('creative_project_submissions') || '[]');
        
        const allClients = [
          ...(localAI || []).map((p: any) => ({
            id: p.id || Date.now().toString(),
            name: p.contact_name,
            email: p.contact_email,
            phone: p.phone,
            company: p.company,
            plan: p.service_type,
            project_type: p.project_name,
            timeline: p.timeline,
            status: p.status || 'pending',
            estimated_value: p.estimated_value || p.budget || 0,
            qualification_score: p.qualification_score || 0,
            created_at: p.created_at || new Date().toISOString()
          })),
          ...(localCreative || []).map((p: any) => ({
            id: p.id || Date.now().toString(),
            name: p.contact_name,
            email: p.contact_email,
            phone: p.phone,
            company: p.company,
            plan: p.service_type,
            project_type: p.project_name,
            timeline: p.timeline,
            status: p.status || 'pending',
            estimated_value: p.budget || 0,
            qualification_score: 0,
            created_at: p.created_at || new Date().toISOString()
          }))
        ];
        
        setClients(allClients);
        console.log('📊 Loaded clients from localStorage:', allClients.length);
      } else {
        // Combine real-time data from Supabase
        const allClients = [
          ...(aiProjects || []).map((p: any) => ({
            id: p.id,
            name: p.contact_name,
            email: p.contact_email,
            phone: p.phone,
            company: p.company,
            plan: p.service_type,
            project_type: p.project_name,
            timeline: p.timeline,
            status: p.status,
            estimated_value: p.estimated_value,
            qualification_score: p.qualification_score,
            created_at: p.created_at
          })),
          ...(creativeProjects || []).map((p: any) => ({
            id: p.id,
            name: p.contact_name,
            email: p.contact_email,
            phone: p.phone,
            company: p.company,
            plan: p.service_type,
            project_type: p.project_name,
            timeline: p.timeline,
            status: p.status,
            estimated_value: p.budget,
            qualification_score: 0,
            created_at: p.created_at
          }))
        ];
        
        setClients(allClients);
        console.log('📊 Loaded clients from Supabase:', allClients.length);
        
        // Set up real-time subscription for live updates
        const aiChannel = supabase
          .channel('ai_projects')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'ai_projects' },
            (payload: any) => {
              console.log('🔄 Real-time AI update:', payload);
              const newClient = payload.new as any;
              if (newClient) {
                setClients(prev => {
                  const filtered = prev.filter(c => c.id !== newClient.id);
                  return [...filtered, {
                    id: newClient.id,
                    name: newClient.contact_name,
                    email: newClient.contact_email,
                    phone: newClient.phone,
                    company: newClient.company,
                    plan: newClient.service_type,
                    project_type: newClient.project_name,
                    timeline: newClient.timeline,
                    status: newClient.status,
                    estimated_value: newClient.estimated_value,
                    qualification_score: newClient.qualification_score,
                    created_at: newClient.created_at
                  }];
                });
              }
            }
          )
          .subscribe();

        const creativeChannel = supabase
          .channel('creative_projects')
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'creative_projects' },
            (payload: any) => {
              console.log('🔄 Real-time Creative update:', payload);
              const newClient = payload.new as any;
              if (newClient) {
                setClients(prev => {
                  const filtered = prev.filter(c => c.id !== newClient.id);
                  return [...filtered, {
                    id: newClient.id,
                    name: newClient.contact_name,
                    email: newClient.contact_email,
                    phone: newClient.phone,
                    company: newClient.company,
                    plan: newClient.service_type,
                    project_type: newClient.project_name,
                    timeline: newClient.timeline,
                    status: newClient.status,
                    estimated_value: newClient.budget,
                    qualification_score: 0,
                    created_at: newClient.created_at
                  }];
                });
              }
            }
          )
          .subscribe();

        // Store subscriptions for cleanup
        subscriptionRefs.current.push(aiChannel, creativeChannel);
      }
      
    } catch (error: any) {
      console.error('❌ Fetch clients error:', error);
      setError('Failed to load clients. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      // Mock users data - no Edge Function calls
      const mockUsers = [
        { id: '1', email: '9lmntstudio@gmail.com', name: 'Admin', role: 'admin', created_at: new Date().toISOString() }
      ];
      setUsers(mockUsers);
      console.log('👥 Loaded mock users (no Edge Functions)');
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.type || !newProject.budget) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      
      // Insert into ai_projects table with proper typing
      const { data, error } = await (supabase as any)
        .from('ai_projects')
        .insert({
          project_name: newProject.name,
          service_type: newProject.type,
          status: newProject.status,
          budget: parseFloat(newProject.budget),
          contact_email: 'admin@9lmntsstudio.com',
          contact_name: 'Admin Created',
          company: newProject.client || '9LMNTS Studio',
          description: `Admin created project: ${newProject.name}`,
          timeline: '2 weeks',
          phone: '',
          website: ''
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchProjects();
      setShowNewProjectModal(false);
      setNewProject({ name: '', type: '', budget: '', status: 'pending', client: '', clientId: '' });
      setSuccess('Project created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error creating project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Delete from ai_projects table
      const { error } = await (supabase as any)
        .from('ai_projects')
        .delete()
        .eq('id', id);

      if (error) throw new Error('Failed to delete project');

      await fetchProjects();
      setSuccess('Project deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.email) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      
      // Insert into ai_projects table as a client
      const { data, error } = await (supabase as any)
        .from('ai_projects')
        .insert({
          project_name: `Client: ${newClient.name}`,
          service_type: 'client-management',
          status: newClient.status || 'prospect',
          budget: 0,
          contact_email: newClient.email,
          contact_name: newClient.name,
          company: newClient.company || '',
          description: newClient.notes || '',
          timeline: '',
          phone: newClient.phone || '',
          website: ''
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchClients();
      setShowNewClientModal(false);
      setNewClient({ name: '', company: '', email: '', phone: '', location: '', status: 'prospect', nextMeeting: '', notes: '' });
      setSuccess('Client created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      
      // Update in ai_projects table
      const { data, error } = await (supabase as any)
        .from('ai_projects')
        .update({
          project_name: `Client: ${editingClient.name}`,
          service_type: 'client-management',
          status: editingClient.status || 'prospect',
          contact_email: editingClient.email,
          contact_name: editingClient.name,
          company: editingClient.company || '',
          description: editingClient.notes || '',
          phone: editingClient.phone || '',
          website: ''
        })
        .eq('id', editingClient.id)
        .select('id')
        .single();

      if (error) throw error;

      await fetchClients();
      setEditingClient(null);
      setSuccess('Client updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating client:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      
      // Try deleting from ai_projects first
      let { error: aiError } = await supabase
        .from('ai_projects')
        .delete()
        .eq('id', id);
      
      // If not found in ai_projects, try creative_projects
      if (aiError) {
        let { error: creativeError } = await supabase
          .from('creative_projects')
          .delete()
          .eq('id', id);
        
        if (creativeError) {
          throw new Error('Failed to delete client from both tables');
        }
      }

      await fetchClients();
      setSuccess('Client deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error deleting client:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Mock user creation - no Edge Functions
      console.log('👤 Creating user (mock):', newUser);
      setSuccess('User created successfully! (Mock)');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClients = clients?.filter(c => {
    // Safely handle undefined/null values
    const name = c?.name || '';
    const company = c?.company || '';
    const email = c?.email || '';
    const status = c?.status || 'pending';
    
    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'prospect': return '#FF7A00';
      case 'completed': return '#00D4FF';
      case 'on-hold': return '#E91E63';
      case 'pending': return '#FF7A00';
      case 'cancelled': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const statusCounts = {
    all: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    prospect: clients.filter(c => c.status === 'prospect').length,
    completed: clients.filter(c => c.status === 'completed').length,
    'on-hold': clients.filter(c => c.status === 'on-hold').length,
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-white/5 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#E91E63] flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:opacity-90 transition-opacity"
            >
              <Layers size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-xl font-bold">9LMNTS Studio Admin</h1>
              <p className="text-xs text-white/40">Welcome, {user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-[#1A1A1A] border border-white/10 text-sm focus:outline-none focus:border-[#00D4FF]/50 w-64 transition-all"
              />
            </div>
            <button className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#E91E63] rounded-full border border-[#1A1A1A]" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-[#E91E63]/10 text-[#E91E63] border border-[#E91E63]/20 hover:bg-[#E91E63]/20 transition-colors text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mt-4 border-b border-white/5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'projects', label: 'Projects', icon: Layers },
            { id: 'clients', label: 'CRM', icon: Briefcase },
            { id: 'users', label: 'Users', icon: UsersIcon },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm relative transition-colors ${
                activeView === tab.id ? 'text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {activeView === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-4 right-4 z-50 bg-[#10B981] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <Check size={20} />
          {success}
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-[#E91E63] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <AlertCircle size={20} />
          {error}
          <button onClick={() => setError('')} className="ml-2">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewClientModal(true)}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors flex items-center gap-2 font-bold"
                >
                  <Plus size={18} />
                  New Client
                </button>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors flex items-center gap-2 font-bold"
                >
                  <Plus size={18} />
                  New Project
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/20 flex items-center justify-center">
                    <Layers className="text-[#00D4FF]" size={20} />
                  </div>
                  <div className="text-sm text-white/60">Total Projects</div>
                </div>
                <div className="text-3xl font-bold">{projects.length}</div>
                <div className="text-sm text-[#10B981] mt-2">+{projects.filter(p => p.status === 'active').length} active</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                    <DollarSign className="text-[#10B981]" size={20} />
                  </div>
                  <div className="text-sm text-white/60">Total Revenue</div>
                </div>
                <div className="text-3xl font-bold">
                  ${projects.reduce((sum, p) => sum + (p.revenue || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-[#10B981] mt-2">From projects</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/20 flex items-center justify-center">
                    <Briefcase className="text-[#FF7A00]" size={20} />
                  </div>
                  <div className="text-sm text-white/60">Total Clients</div>
                </div>
                <div className="text-3xl font-bold">{clients.length}</div>
                <div className="text-sm text-white/60 mt-2">{clients.filter(c => c.status === 'prospect').length} prospects</div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E91E63]/20 flex items-center justify-center">
                    <UsersIcon className="text-[#E91E63]" size={20} />
                  </div>
                  <div className="text-sm text-white/60">Total Users</div>
                </div>
                <div className="text-3xl font-bold">{users.length || '—'}</div>
                <button onClick={fetchUsers} className="text-sm text-[#00D4FF] mt-2 hover:underline">
                  Load users
                </button>
              </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Recent Projects</h3>
                  <button onClick={() => setActiveView('projects')} className="text-sm text-[#00D4FF] hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {projects.slice(0, 5).map(project => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-[#111] rounded-lg hover:bg-[#1A1A1A] transition-colors">
                      <div className="flex-1">
                        <div className="font-bold">{project.name}</div>
                        <div className="text-sm text-white/60">{project.client}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-white/60">Revenue</div>
                          <div className="font-bold text-[#10B981]">${(project.revenue || 0).toLocaleString()}</div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold`}
                          style={{ 
                            backgroundColor: `${getStatusColor(project.status)}20`,
                            color: getStatusColor(project.status)
                          }}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      No projects yet. Create your first project!
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Clients */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Recent Clients</h3>
                  <button onClick={() => setActiveView('clients')} className="text-sm text-[#00D4FF] hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {clients.slice(0, 5).map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-[#111] rounded-lg hover:bg-[#1A1A1A] transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00D4FF] to-[#10B981] rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold">{client.name}</div>
                          <div className="text-sm text-white/60">{client.company}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold`}
                        style={{ 
                          backgroundColor: `${getStatusColor(client.status)}20`,
                          color: getStatusColor(client.status)
                        }}>
                        {client.status}
                      </span>
                    </div>
                  ))}
                  {clients.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      No clients yet. Add your first client!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects View */}
        {activeView === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Projects</h2>
              <div className="flex gap-3">
                <button
                  onClick={fetchProjects}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1A1A1A] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 font-bold disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors flex items-center gap-2 font-bold"
                >
                  <Plus size={18} />
                  New Project
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <RefreshCw size={32} className="animate-spin mx-auto text-[#00D4FF]" />
                <p className="text-white/60 mt-4">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                <Layers size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/60">No projects found. Create your first project!</p>
              </div>
            ) : (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#111] border-b border-white/10">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Project Name</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Client</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Type</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Budget</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Revenue</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(project => (
                      <tr key={project.id} className="border-b border-white/5 hover:bg-[#111] transition-colors">
                        <td className="px-6 py-4 font-bold">{project.name}</td>
                        <td className="px-6 py-4 text-white/80">{project.client}</td>
                        <td className="px-6 py-4 text-sm text-white/60">{project.type}</td>
                        <td className="px-6 py-4 font-mono">${(project.budget || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 font-mono text-[#10B981]">${(project.revenue || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold`}
                            style={{ 
                              backgroundColor: `${getStatusColor(project.status)}20`,
                              color: getStatusColor(project.status)
                            }}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                              <Edit size={16} className="text-[#00D4FF]" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} className="text-[#E91E63]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Clients (CRM) View */}
        {activeView === 'clients' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Client Relationship Manager</h2>
              <div className="flex gap-3">
                <button
                  onClick={fetchClients}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1A1A1A] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 font-bold disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowNewClientModal(true)}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors flex items-center gap-2 font-bold"
                >
                  <Plus size={18} />
                  New Client
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-4 flex-wrap">
              {Object.entries(statusCounts).map(([status, count]) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-6 py-3 rounded-lg transition-all font-bold ${
                    filterStatus === status
                      ? 'bg-[#00D4FF] text-[#0A0A0A]'
                      : 'bg-[#1A1A1A] text-white/60 hover:bg-[#1A1A1A]/80'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({count})
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <RefreshCw size={32} className="animate-spin mx-auto text-[#00D4FF]" />
                <p className="text-white/60 mt-4">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-20 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                <Briefcase size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/60">
                  {clients.length === 0 ? 'No clients found. Add your first client!' : 'No clients match your search or filter.'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 hover:border-[#00D4FF]/50 transition-all"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00D4FF] to-[#10B981] rounded-full flex items-center justify-center text-white font-bold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-white font-bold">{client.name}</div>
                          <div className="text-white/60 text-sm">{client.company}</div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-[#111] rounded-lg transition-all">
                        <MoreVertical className="text-white/40" size={18} />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div 
                      className="inline-block px-3 py-1 rounded-full text-xs mb-4 font-bold"
                      style={{ 
                        backgroundColor: `${getStatusColor(client.status)}20`,
                        color: getStatusColor(client.status)
                      }}
                    >
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Mail size={14} />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <Phone size={14} />
                          {client.phone}
                        </div>
                      )}
                      {client.location && (
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <MapPin size={14} />
                          {client.location}
                        </div>
                      )}
                    </div>

                    {/* Revenue & Next Meeting */}
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-white/60 text-xs mb-1">Revenue</div>
                        <div className="text-[#10B981] font-bold">${(client.revenue || 0).toLocaleString()}</div>
                      </div>
                      {client.nextMeeting && (
                        <div className="text-right">
                          <div className="text-white/60 text-xs mb-1">Next Meeting</div>
                          <div className="text-white text-sm flex items-center gap-1">
                            <Calendar size={14} />
                            {client.nextMeeting}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingClient(client)}
                        className="flex-1 px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#00D4FF]/90 transition-all flex items-center justify-center gap-2 font-bold"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClient(client.id)}
                        className="px-4 py-2 bg-[#111] text-[#E91E63] rounded-lg hover:bg-[#111]/80 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Users</h2>
              <div className="flex gap-3">
                <button
                  onClick={fetchUsers}
                  disabled={loading}
                  className="px-4 py-2 bg-[#1A1A1A] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 font-bold disabled:opacity-50"
                >
                  <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowNewUserModal(true)}
                  className="px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors flex items-center gap-2 font-bold"
                >
                  <Plus size={18} />
                  New User
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <RefreshCw size={32} className="animate-spin mx-auto text-[#00D4FF]" />
                <p className="text-white/60 mt-4">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                <UsersIcon size={48} className="mx-auto text-white/20 mb-4" />
                <p className="text-white/60">No users found. Click "Refresh" to load users.</p>
              </div>
            ) : (
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#111] border-b border-white/10">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Name</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Joined</th>
                      <th className="text-left px-6 py-4 text-sm font-bold text-white/60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-[#111] transition-colors">
                        <td className="px-6 py-4 font-bold">{u.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-white/80">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'admin' ? 'bg-[#E91E63]/20 text-[#E91E63]' : 'bg-[#00D4FF]/20 text-[#00D4FF]'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                              <Edit size={16} className="text-[#00D4FF]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings View */}
        {activeView === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={user.name}
                    disabled
                    className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Role</label>
                  <input 
                    type="text" 
                    value={user.role}
                    disabled
                    className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4">Danger Zone</h3>
              <button className="px-4 py-2 bg-[#E91E63]/10 text-[#E91E63] border border-[#E91E63]/20 rounded-lg hover:bg-[#E91E63]/20 transition-colors font-bold">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New Project</h3>
              <button onClick={() => setShowNewProjectModal(false)}>
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Project Name *</label>
                <input 
                  type="text" 
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., Sound Clash OS"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Project Type *</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="">Select type</option>
                  <option value="7-Day Agentic Sprint (AI Automation)">7-Day Agentic Sprint (AI Automation)</option>
                  <option value="Brand Identity & Logo Design">Brand Identity & Logo Design</option>
                  <option value="Website Design & Development">Website Design & Development</option>
                  <option value="E-commerce Platform">E-commerce Platform</option>
                  <option value="Mobile App Design">Mobile App Design</option>
                  <option value="Marketing Campaign">Marketing Campaign</option>
                  <option value="Full Digital Transformation">Full Digital Transformation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Client</label>
                <select
                  value={newProject.clientId}
                  onChange={(e) => {
                    const selectedClient = clients.find(c => c.id === e.target.value);
                    setNewProject({ 
                      ...newProject, 
                      clientId: e.target.value,
                      client: selectedClient ? selectedClient.name : ''
                    });
                  }}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="">Select client (optional)</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} - {client.company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Budget (CAD) *</label>
                <input 
                  type="number" 
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  placeholder="15000"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Status</label>
                <select
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {error && (
                <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 text-[#E91E63] px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#111] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-md w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add New Client</h3>
              <button onClick={() => setShowNewClientModal(false)}>
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <input 
                  type="text" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Company</label>
                <input 
                  type="text" 
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  placeholder="Company Inc."
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Email *</label>
                <input 
                  type="email" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Location</label>
                <input 
                  type="text" 
                  value={newClient.location}
                  onChange={(e) => setNewClient({ ...newClient, location: e.target.value })}
                  placeholder="Toronto, ON"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Status</label>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient({ ...newClient, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Next Meeting</label>
                <input 
                  type="text" 
                  value={newClient.nextMeeting}
                  onChange={(e) => setNewClient({ ...newClient, nextMeeting: e.target.value })}
                  placeholder="Dec 15, 2025"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Notes</label>
                <textarea 
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  placeholder="Additional notes about the client..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 text-[#E91E63] px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewClientModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#111] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClient}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#10B981]/90 transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Client'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-md w-full my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Edit Client</h3>
              <button onClick={() => setEditingClient(null)}>
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <input 
                  type="text" 
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Company</label>
                <input 
                  type="text" 
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({ ...editingClient, company: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Email *</label>
                <input 
                  type="email" 
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Location</label>
                <input 
                  type="text" 
                  value={editingClient.location}
                  onChange={(e) => setEditingClient({ ...editingClient, location: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Status</label>
                <select
                  value={editingClient.status}
                  onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Next Meeting</label>
                <input 
                  type="text" 
                  value={editingClient.nextMeeting || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, nextMeeting: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Notes</label>
                <textarea 
                  value={editingClient.notes || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 text-[#E91E63] px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingClient(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#111] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClient}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Client'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Create New User</h3>
              <button onClick={() => setShowNewUserModal(false)}>
                <X size={20} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Name *</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Email *</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Password *</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-white focus:border-[#00D4FF] focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && (
                <div className="bg-[#E91E63]/10 border border-[#E91E63]/20 text-[#E91E63] px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewUserModal(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#111] border border-white/10 text-white rounded-lg hover:bg-white/5 transition-colors font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-[#00D4FF] text-black rounded-lg hover:bg-[#33E0FF] transition-colors font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
