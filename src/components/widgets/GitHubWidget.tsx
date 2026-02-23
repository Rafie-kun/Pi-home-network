import { useState, useEffect } from 'react';
import { Github, Star, Users, GitFork } from 'lucide-react';

export function GitHubWidget() {
  const [stats, setStats] = useState({
    username: 'Rafie-kun',
    name: 'Loading...',
    bio: 'Fetching GitHub profile...',
    avatar: 'https://github.com/identicons/rafie.png',
    stars: 0,
    followers: 0,
    repos: 0,
    contributions: 0
  });

  useEffect(() => {
    // Simulate GitHub data (would fetch from API in production)
    setTimeout(() => {
      setStats({
        username: 'Rafie-kun',
        name: 'Rafie',
        bio: 'Full-stack developer | Self-hosting enthusiast | Pi enthusiast',
        avatar: 'https://github.com/identicons/rafie.png',
        stars: 127,
        followers: 89,
        repos: 34,
        contributions: 847
      });
    }, 1000);
  }, []);

  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Github className="w-6 h-6 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">GitHub Stats</h3>
        <div className="ml-auto flex gap-2">
          <StatPill icon={Star} value={stats.stars} />
          <StatPill icon={Users} value={stats.followers} />
          <StatPill icon={GitFork} value={stats.repos} label="repos" />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img 
          src={stats.avatar} 
          alt={stats.username}
          className="w-16 h-16 rounded-full border-2 border-emerald-500/50"
        />
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-white">{stats.name}</h4>
          <p className="text-sm text-emerald-200/70">@{stats.username}</p>
          <p className="text-sm text-slate-400 mt-1">{stats.bio}</p>
        </div>
      </div>

      {/* Contribution Graph Simulation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Contribution Activity</span>
          <span>{stats.contributions} contributions this year</span>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: 48 }).map((_, i) => (
            <div 
              key={i}
              className="aspect-square rounded-sm bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors"
              style={{ opacity: 0.2 + Math.random() * 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, value, label }: { icon: any, value: number, label?: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <Icon className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-sm font-medium text-emerald-300">{value}</span>
      {label && <span className="text-xs text-emerald-400/70">{label}</span>}
    </div>
  );
}
