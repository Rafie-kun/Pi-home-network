import { GitCommit, Clock, ExternalLink } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  repo: string;
  time: string;
  sha: string;
}

export function RecentCommits() {
  const commits: Commit[] = [
    {
      id: '1',
      message: 'Add n8n workflow integration',
      repo: 'pi-dashboard',
      time: '2 hours ago',
      sha: 'a3f7b91'
    },
    {
      id: '2',
      message: 'Update system monitoring widgets',
      repo: 'pi-dashboard',
      time: '5 hours ago',
      sha: '8c2e1d4'
    },
    {
      id: '3',
      message: 'Fix weather API integration',
      repo: 'pi-dashboard',
      time: '1 day ago',
      sha: 'f9a2c8b'
    },
    {
      id: '4',
      message: 'Improve responsive design',
      repo: 'pi-dashboard',
      time: '2 days ago',
      sha: '5d8e3a1'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Recent Commits</h3>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
          View All
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3">
        {commits.map(commit => (
          <div 
            key={commit.id}
            className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <GitCommit className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {commit.message}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="font-mono">{commit.sha}</span>
                  <span>•</span>
                  <span>{commit.repo}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {commit.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
