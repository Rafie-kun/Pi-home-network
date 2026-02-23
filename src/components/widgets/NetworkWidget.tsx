import { Network, Download, Upload, Activity } from 'lucide-react';

interface NetworkWidgetProps {
  downloadSpeed: number;
  uploadSpeed: number;
}

export function NetworkWidget({ downloadSpeed, uploadSpeed }: NetworkWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Network className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Network Activity</h3>
        <div className="ml-auto flex items-center gap-1">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-400">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Download Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Download</span>
            </div>
            <span className="text-lg font-bold text-white">
              {downloadSpeed.toFixed(1)} MB/s
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${Math.min(downloadSpeed * 4, 100)}%` }}
            />
          </div>
        </div>

        {/* Upload Speed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-slate-300">Upload</span>
            </div>
            <span className="text-lg font-bold text-white">
              {uploadSpeed.toFixed(1)} MB/s
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(uploadSpeed * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Network Info */}
        <div className="pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400">Local IP</p>
            <p className="text-sm font-mono text-white mt-1">192.168.1.104</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Gateway</p>
            <p className="text-sm font-mono text-white mt-1">192.168.1.1</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">DNS</p>
            <p className="text-sm font-mono text-white mt-1">1.1.1.1</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Connection</p>
            <p className="text-sm font-medium text-emerald-400 mt-1">Wi-Fi 6E</p>
          </div>
        </div>
      </div>
    </div>
  );
}
