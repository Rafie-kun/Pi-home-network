import { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Thermometer, 
  Activity,
  Download,
  Upload
} from 'lucide-react';
import { SystemGauge } from './widgets/SystemGauge';
import { WeatherWidget } from './widgets/WeatherWidget';
import { GitHubWidget } from './widgets/GitHubWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { NetworkWidget } from './widgets/NetworkWidget';
import { RecentCommits } from './widgets/RecentCommits';

export function Dashboard() {
  const [systemData, setSystemData] = useState({
    cpu: 24.5,
    ram: 52.3,
    disk: 68.7,
    temp: 42.8,
    networkDown: 12.4,
    networkUp: 3.2,
  });

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => setTime(new Date()), 1000);

    // Simulate real-time system updates
    const dataInterval = setInterval(() => {
      setSystemData({
        cpu: 15 + Math.random() * 40,
        ram: 40 + Math.random() * 30,
        disk: 60 + Math.random() * 15,
        temp: 38 + Math.random() * 15,
        networkDown: Math.random() * 25,
        networkUp: Math.random() * 10,
      });
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard 
          icon={Cpu} 
          label="CPU" 
          value={`${systemData.cpu.toFixed(1)}%`}
          color="emerald"
        />
        <StatCard 
          icon={Activity} 
          label="RAM" 
          value={`${systemData.ram.toFixed(1)}%`}
          color="violet"
        />
        <StatCard 
          icon={Thermometer} 
          label="Temp" 
          value={`${systemData.temp.toFixed(1)}°C`}
          color="orange"
        />
        <StatCard 
          icon={HardDrive} 
          label="Disk" 
          value={`${systemData.disk.toFixed(1)}%`}
          color="blue"
        />
        <StatCard 
          icon={Download} 
          label="Download" 
          value={`${systemData.networkDown.toFixed(1)} MB/s`}
          color="cyan"
        />
        <StatCard 
          icon={Upload} 
          label="Upload" 
          value={`${systemData.networkUp.toFixed(1)} MB/s`}
          color="pink"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clock Widget - Tall */}
        <div className="lg:row-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 flex flex-col items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-slate-400 text-sm font-medium">Local Time</p>
            <div className="text-7xl font-bold bg-gradient-to-br from-emerald-400 to-violet-600 bg-clip-text text-transparent">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-2xl text-slate-500">
              :{time.toLocaleTimeString('en-US', { second: '2-digit' }).split(':')[2]}
            </p>
            <div className="space-y-1">
              <p className="text-slate-300 text-lg">
                {time.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-slate-500 text-sm">
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <WeatherWidget />

        {/* System Gauges */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">System Vitals</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SystemGauge label="CPU" value={systemData.cpu} max={100} color="emerald" />
            <SystemGauge label="RAM" value={systemData.ram} max={100} color="violet" />
            <SystemGauge label="Temp" value={systemData.temp} max={85} color="orange" />
            <SystemGauge label="Disk" value={systemData.disk} max={100} color="blue" />
          </div>
        </div>

        {/* GitHub Stats */}
        <GitHubWidget />

        {/* Recent Commits */}
        <RecentCommits />

        {/* Tasks Widget */}
        <TasksWidget />

        {/* Network Widget */}
        <NetworkWidget 
          downloadSpeed={systemData.networkDown} 
          uploadSpeed={systemData.networkUp} 
        />
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
}) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 text-orange-400',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400',
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} 
      backdrop-blur-xl border rounded-xl p-4 flex items-center gap-3
    `}>
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-lg font-bold truncate">{value}</p>
      </div>
    </div>
  );
}
