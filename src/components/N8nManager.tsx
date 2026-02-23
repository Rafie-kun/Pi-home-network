import { useState } from 'react';
import { Workflow, Play, Pause, Plus, Search, Zap, Clock, CheckCircle } from 'lucide-react';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  icon: string;
  category: string;
  lastRun?: string;
  executions: number;
}

export function N8nManager() {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([
    { id: '1', name: 'Discord Alerts', active: true, icon: '💬', category: 'Notifications', lastRun: '2 min ago', executions: 127 },
    { id: '2', name: 'GitHub Watcher', active: true, icon: '🐙', category: 'Development', lastRun: '15 min ago', executions: 89 },
    { id: '3', name: 'Home Assistant Sync', active: false, icon: '🏠', category: 'Home Automation', lastRun: '1 hour ago', executions: 234 },
    { id: '4', name: 'Telegram Bot', active: true, icon: '✈️', category: 'Communication', lastRun: '5 min ago', executions: 456 },
    { id: '5', name: 'RSS Feed Digest', active: true, icon: '📰', category: 'Content', lastRun: '3 hours ago', executions: 67 },
    { id: '6', name: 'Pi-hole Stats', active: false, icon: '🛡️', category: 'Network', lastRun: '1 day ago', executions: 23 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, active: !w.active } : w
    ));
  };

  const filteredWorkflows = workflows.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || w.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(workflows.map(w => w.category))];
  const activeCount = workflows.filter(w => w.active).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard label="Total Workflows" value={workflows.length} icon={Workflow} color="violet" />
        <StatsCard label="Active" value={activeCount} icon={Zap} color="emerald" />
        <StatsCard label="Executions Today" value="847" icon={Clock} color="blue" />
        <StatsCard label="Success Rate" value="98.2%" icon={CheckCircle} color="cyan" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workflows..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-violet-500 hover:bg-violet-600 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Workflow
          </button>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkflows.map(workflow => (
          <WorkflowCard
            key={workflow.id}
            workflow={workflow}
            onToggle={() => toggleWorkflow(workflow.id)}
          />
        ))}
      </div>

      {/* Add Workflow Modal */}
      {showAddModal && (
        <AddWorkflowModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  const colors = {
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} backdrop-blur-xl border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}

function WorkflowCard({ workflow, onToggle }: { workflow: N8nWorkflow; onToggle: () => void }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:border-violet-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{workflow.icon}</div>
          <div>
            <h3 className="font-semibold text-white">{workflow.name}</h3>
            <p className="text-xs text-slate-400">{workflow.category}</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`
            p-2 rounded-lg transition-all
            ${workflow.active 
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
              : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
            }
          `}
        >
          {workflow.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Status</span>
          <span className={workflow.active ? 'text-emerald-400' : 'text-slate-500'}>
            {workflow.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Last Run</span>
          <span className="text-slate-300">{workflow.lastRun}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Executions</span>
          <span className="text-slate-300">{workflow.executions}</span>
        </div>
      </div>
    </div>
  );
}

function AddWorkflowModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Add New Workflow</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Workflow Name</label>
            <input
              type="text"
              placeholder="My Automation"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Category</label>
            <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500/50">
              <option>Notifications</option>
              <option>Development</option>
              <option>Home Automation</option>
              <option>Communication</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg text-white transition-colors"
            >
              Add Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
