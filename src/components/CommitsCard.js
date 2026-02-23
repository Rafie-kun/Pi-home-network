import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

export default function CommitsCard({ config }) {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (config.GITHUB_USERNAME === 'YOUR_GITHUB_USERNAME') {
        setCommits(getDemoCommits());
        setLoading(false);
        return;
      }
      const headers = config.GITHUB_TOKEN
        ? { Authorization: `token ${config.GITHUB_TOKEN}` }
        : {};
      try {
        // Fetch events to get recent commits
        const eventsRes = await axios.get(
          `https://api.github.com/users/${config.GITHUB_USERNAME}/events/public?per_page=30`,
          { headers }
        );
        const pushEvents = eventsRes.data.filter(e => e.type === 'PushEvent');
        const flat = [];
        for (const ev of pushEvents) {
          for (const c of (ev.payload.commits || [])) {
            flat.push({
              sha: c.sha.slice(0, 7),
              message: c.message.split('\n')[0],
              repo: ev.repo.name.split('/')[1],
              date: ev.created_at,
            });
            if (flat.length >= 12) break;
          }
          if (flat.length >= 12) break;
        }
        setCommits(flat.length ? flat : getDemoCommits());
      } catch (e) {
        setError('Using demo data');
        setCommits(getDemoCommits());
      }
      setLoading(false);
    };
    load();
  }, [config]);

  return (
    <div className="card" style={{ animationDelay: '0.25s' }}>
      <div className="card-header">
        <span className="card-title">LATEST COMMITS</span>
        <span className="card-icon">⟡</span>
      </div>

      {loading && <div className="loading-dots"><span/><span/><span/></div>}
      {error && <p style={{fontSize:'9px',color:'var(--yellow)',marginBottom:'10px',letterSpacing:'0.05em'}}>⚠ {error}</p>}

      <div className="commit-list">
        {commits.map((c, i) => (
          <div key={i} className="commit-item">
            <div style={{position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
              <div className="commit-dot" />
              {i < commits.length - 1 && <div className="commit-line" />}
            </div>
            <div className="commit-body">
              <div className="commit-repo">{c.repo}</div>
              <div className="commit-msg">{c.message}</div>
              <div className="commit-sha">
                <span style={{color:'var(--accent)', opacity:0.6}}>#</span>{c.sha}
                <span style={{color:'var(--text-dim)', marginLeft:'8px'}}>
                  {formatDistanceToNow(new Date(c.date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getDemoCommits() {
  const now = new Date();
  const ago = (m) => new Date(now - m * 60000).toISOString();
  return [
    { sha: 'a3f9d12', message: 'feat: add auth middleware with JWT refresh', repo: 'portfolio-api', date: ago(12) },
    { sha: 'b8e2c01', message: 'fix: resolve race condition in data fetch hook', repo: 'pi-dashboard', date: ago(45) },
    { sha: 'c7d4a55', message: 'chore: update dependencies, bump axios to 1.6', repo: 'pi-dashboard', date: ago(120) },
    { sha: 'd1b9f33', message: 'feat: responsive layout for mobile screens', repo: 'portfolio-site', date: ago(200) },
    { sha: 'e5c2a87', message: 'docs: add API reference and setup guide', repo: 'portfolio-api', date: ago(360) },
    { sha: 'f0a3d19', message: 'refactor: extract GitHub hooks into separate module', repo: 'pi-dashboard', date: ago(480) },
    { sha: '2b7e4c8', message: 'test: add integration tests for /api/system route', repo: 'pi-dashboard', date: ago(720) },
    { sha: '3c8f5d6', message: 'feat: contribution heatmap visualization', repo: 'pi-dashboard', date: ago(960) },
  ];
}
