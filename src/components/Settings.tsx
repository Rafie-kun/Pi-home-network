import { Save, RefreshCw, Github, Cloud, Workflow as WorkflowIcon, Server } from 'lucide-react';

export function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard Settings</h2>
        <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg font-medium text-white transition-colors flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* GitHub Settings */}
      <SettingsCard icon={Github} title="GitHub Integration" color="emerald">
        <SettingField
          label="GitHub Username"
          placeholder="your-username"
          value="Rafie-kun"
        />
        <SettingField
          label="Personal Access Token (optional)"
          placeholder="ghp_xxxxxxxxxxxx"
          type="password"
          hint="For higher rate limits and private repos"
        />
      </SettingsCard>

      {/* Weather Settings */}
      <SettingsCard icon={Cloud} title="Weather" color="amber">
        <SettingField
          label="OpenWeatherMap API Key"
          placeholder="your_api_key"
          hint="Get free key at openweathermap.org"
        />
        <SettingField
          label="City"
          placeholder="London"
          value="London"
        />
      </SettingsCard>

      {/* n8n Settings */}
      <SettingsCard icon={WorkflowIcon} title="n8n Automation" color="violet">
        <SettingField
          label="n8n Base URL"
          placeholder="http://192.168.1.104:5678"
          value="http://localhost:5678"
        />
        <SettingField
          label="API Key (optional)"
          placeholder="n8n_api_key_..."
          type="password"
        />
      </SettingsCard>

      {/* System API Settings */}
      <SettingsCard icon={Server} title="Pi System Stats" color="blue">
        <SettingField
          label="Stats API URL"
          placeholder="http://localhost:3001/api/stats"
          hint="Leave blank to use mock data"
        />
        <SettingField
          label="Pi Hostname"
          placeholder="raspberrypi-node-05"
          value="raspberrypi-node-05"
        />
        <SettingField
          label="Update Interval (seconds)"
          placeholder="3"
          value="3"
          type="number"
        />
      </SettingsCard>

      {/* Advanced Settings */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Advanced Options</h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Enable Auto-refresh"
            description="Automatically update dashboard data"
            defaultChecked={true}
          />
          <ToggleSetting
            label="Show System Notifications"
            description="Display alerts for high CPU, temp, etc."
            defaultChecked={true}
          />
          <ToggleSetting
            label="Dark Mode"
            description="Use dark theme (always on for this dashboard)"
            defaultChecked={true}
            disabled={true}
          />
          <ToggleSetting
            label="Enable Animations"
            description="Smooth transitions and effects"
            defaultChecked={true}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
            Clear Cache
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
            Export Configuration
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
            Import Configuration
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-slate-500">
        Changes are saved to localStorage and will persist across sessions
      </p>
    </div>
  );
}

function SettingsCard({ 
  icon: Icon, 
  title, 
  color, 
  children 
}: { 
  icon: any; 
  title: string; 
  color: string; 
  children: React.ReactNode;
}) {
  const colors = {
    emerald: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-500/30 text-amber-400',
    violet: 'from-violet-500/10 to-violet-600/10 border-violet-500/30 text-violet-400',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color as keyof typeof colors]} backdrop-blur-xl border rounded-2xl p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <Icon className="w-5 h-5" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingField({ 
  label, 
  placeholder, 
  value, 
  type = 'text', 
  hint 
}: { 
  label: string; 
  placeholder: string; 
  value?: string; 
  type?: string; 
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-colors"
      />
      {hint && (
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      )}
    </div>
  );
}

function ToggleSetting({ 
  label, 
  description, 
  defaultChecked, 
  disabled = false 
}: { 
  label: string; 
  description: string; 
  defaultChecked?: boolean; 
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className={`
          w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer
          peer-checked:after:translate-x-full peer-checked:after:border-white
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          ${!disabled && 'peer-checked:bg-violet-500'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
        `}></div>
      </label>
    </div>
  );
}
