import { useState, useEffect } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { N8nManager } from '@/components/N8nManager';
import { PiOsGuide } from '@/components/PiOsGuide';
import { TerminalSimulator } from '@/components/TerminalSimulator';
import { Settings } from '@/components/Settings';
import { 
  LayoutDashboard, 
  Workflow, 
  Terminal, 
  BookOpen, 
  Settings as SettingsIcon,
  Cpu,
  Activity
} from 'lucide-react';

type Tab = 'dashboard' | 'n8n' | 'terminal' | 'guide' | 'settings';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    cpu: 0,
    temp: 0,
    uptime: '0h 0m'
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time system stats
    const interval = setInterval(() => {
      setSystemStats({
        cpu: Math.random() * 100,
        temp: 40 + Math.random() * 25,
        uptime: `${Math.floor(Math.random() * 168)}h ${Math.floor(Math.random() * 60)}m`
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-6">
          <div className="relative">
            <Cpu className="w-16 h-16 text-emerald-500 animate-pulse" />
            <Activity className="w-8 h-8 text-violet-500 absolute top-0 right-0 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pi5 Command Center</h2>
            <p className="text-slate-400">Initializing systems...</p>
          </div>
          <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 animate-[loading_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'n8n' as Tab, label: 'Automations', icon: Workflow },
    { id: 'terminal' as Tab, label: 'Terminal', icon: Terminal },
    { id: 'guide' as Tab, label: 'Pi OS Guide', icon: BookOpen },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Pi5 Command Center</h1>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                  <span>CPU: {systemStats.cpu.toFixed(1)}%</span>
                  <span>Temp: {systemStats.temp.toFixed(1)}°C</span>
                  <span>Uptime: {systemStats.uptime}</span>
                </div>
              </div>
            </div>

            {/* Status Pills */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                System Healthy
              </div>
              <div className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
                5 Workflows Active
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-white/10 text-white shadow-lg shadow-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'n8n' && <N8nManager />}
        {activeTab === 'terminal' && <TerminalSimulator />}
        {activeTab === 'guide' && <PiOsGuide />}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>Pi5 Command Center v2.0 • Built with React + TypeScript • Open Source</p>
          <p className="mt-1">Perfect for portfolio & self-hosting on Raspberry Pi 5</p>
        </div>
      </footer>
    </div>
  );
}
