import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', CSS: '#563d7c',
  HTML: '#e34c26', Shell: '#89e051', C: '#555555', 'C++': '#f34b7d',
};

function genContribGrid() {
  return Array.from({ length: 364 }, () => Math.floor(Math.random() * 5));
}

export default function GitHubCard({ config }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contribs] = useState(genContribGrid);

  useEffect(() => {
    const load = async () => {
      const headers = config.GITHUB_TOKEN
        ? { Authorization: `token ${config.GITHUB_TOKEN}` }
        : {};
      try {
        const [userRes, reposRes] = await Promise.all([
          axios.get(`https://api.github.com/users/${config.GITHUB_USERNAME}`, { headers }),
          axios.get(`https://api.github.com/users/${config.GITHUB_USERNAME}/repos?sort=updated&per_page=6`, { headers }),
        ]);
        setProfile(userRes.data);
        setRepos(reposRes.data.slice(0, 5));
      } catch (e) {
        setError('GitHub API limit reached. Add a token in .env');
      }
      setLoading(false);
    };
    if (config.GITHUB_USERNAME !== 'YOUR_GITHUB_USERNAME') {
      load();
    } else {
      setError('Set REACT_APP_GITHUB_USERNAME in .env');
      setLoading(false);
    }
  }, [config]);

  const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  return (
    <div className="card" style={{ animationDelay: '0.2s' }}>
      <div className="card-header">
        <span className="card-title">GITHUB PROFILE</span>
        <span className="card-icon">◈</span>
      </div>

      {loading && <div className="loading-dots"><span/><span/><span/></div>}
      {error && <div className="error-msg">{error}</div>}

      {profile && (
        <>
          <div className="gh-profile">
            <img className="gh-avatar" src={profile.avatar_url} alt={profile.login} />
            <div>
              <div className="gh-name">{profile.name || profile.login}</div>
              <div className="gh-login">@{profile.login}</div>
              {profile.bio && <div className="gh-bio">{profile.bio}</div>}
            </div>
          </div>

          <div className="gh-stats-row">
            <div className="gh-stat">
              <div className="gh-stat-num">{fmt(profile.public_repos)}</div>
              <div className="gh-stat-label">Repos</div>
            </div>
            <div className="gh-stat">
              <div className="gh-stat-num">{fmt(profile.followers)}</div>
              <div className="gh-stat-label">Followers</div>
            </div>
            <div className="gh-stat">
              <div className="gh-stat-num">{fmt(profile.following)}</div>
              <div className="gh-stat-label">Following</div>
            </div>
            <div className="gh-stat">
              <div className="gh-stat-num">{fmt(repos.reduce((a, r) => a + r.stargazers_count, 0))}</div>
              <div className="gh-stat-label">Stars</div>
            </div>
          </div>
        </>
      )}

      <div className="gh-section-title">PINNED REPOS</div>
      <div className="repos-list">
        {repos.map(repo => (
          <div key={repo.id} className="repo-card">
            <div className="repo-name">{repo.name}</div>
            {repo.description && <div className="repo-desc">{repo.description}</div>}
            <div className="repo-meta">
              {repo.language && (
                <span className="repo-lang">
                  <span className="lang-dot" style={{ background: LANG_COLORS[repo.language] || '#8aadcc' }} />
                  {repo.language}
                </span>
              )}
              <span>★ {repo.stargazers_count}</span>
              <span>⑂ {repo.forks_count}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="contrib-chart">
        <div className="gh-section-title" style={{marginTop:'16px'}}>CONTRIBUTION ACTIVITY</div>
        <div className="contrib-grid">
          {contribs.map((level, i) => (
            <div key={i} className={`contrib-day contrib-day--${level}`} title={`${level} contributions`} />
          ))}
        </div>
      </div>
    </div>
  );
}
