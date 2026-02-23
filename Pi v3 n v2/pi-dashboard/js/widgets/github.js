/**
 * GitHub Widget — User profile, contributions, stats, and recent commits
 */
const GitHubWidget = {
    _interval: null,
    _user: null,
    _repos: [],
    _events: [],

    async init() {
        await this.refresh();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), cfg.githubRefreshMs || 600000);
    },

    async refresh() {
        try {
            const [user, repos, events] = await Promise.all([
                API.getGitHubUser(),
                API.getGitHubRepos(),
                API.getGitHubEvents(),
            ]);

            this._user = user;
            this._repos = repos;
            this._events = events;

            this.renderProfile(user, repos);
            this.renderContributions();
            this.renderCommits(events);

            utils.addLog(`GitHub data loaded: @${user.login}`, 'success');

            // Update View GitHub button
            const viewBtn = document.getElementById('view-github-btn');
            if (viewBtn) {
                viewBtn.onclick = () => window.open(`https://github.com/${user.login}`, '_blank');
            }

        } catch (e) {
            utils.addLog(`GitHub error: ${e.message}`, 'error');
        }
    },

    renderProfile(user, repos) {
        // Avatar
        const avatarEl = document.getElementById('gh-avatar');
        if (avatarEl) {
            if (user.avatar_url && !user._isMock) {
                avatarEl.src = user.avatar_url;
                avatarEl.style.display = 'block';
            } else {
                avatarEl.style.display = 'none';
            }
        }

        const setEl = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setEl('gh-name', user.name || user.login || 'Developer');
        setEl('gh-bio', user.bio || '🥧 Raspberry Pi enthusiast & developer');

        // Stats
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        const formatNum = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

        setEl('gh-stars', formatNum(totalStars));
        setEl('gh-followers', formatNum(user.followers || 0));
        setEl('gh-repos', `${user.public_repos || repos.length} repos`);
    },

    renderContributions() {
        const container = document.getElementById('contribution-graph');
        if (!container) return;

        // Generate a realistic-looking contribution graph (53 weeks × 7 days)
        // In production, you'd use the GitHub GraphQL API for real data
        // (requires auth token with 'read:user' scope)
        const cfg = utils.getConfig();
        const weeks = 20;
        const totalContribs = Math.floor(Math.random() * 500 + 800);

        // Generate plausible contribution data
        const allDays = [];
        for (let w = 0; w < weeks; w++) {
            const weekDays = [];
            for (let d = 0; d < 7; d++) {
                const dayIndex = w * 7 + d;
                const weekActivity = Math.random() < 0.4 ? 0 : Math.random();
                const burst = d >= 1 && d <= 5 ? 1.5 : 0.8; // weekdays more active
                const activity = weekActivity * burst;

                let level = 0;
                if (activity > 0.1) level = 1;
                if (activity > 0.35) level = 2;
                if (activity > 0.6) level = 3;
                if (activity > 0.85) level = 4;

                weekDays.push({ level, dayIndex });
            }
            allDays.push(weekDays);
        }

        container.innerHTML = `
      <div class="contrib-grid">
        ${allDays.map(week => `
          <div class="contrib-week">
            ${week.map(day => `
              <div class="contrib-day" 
                   data-level="${day.level}" 
                   title="${day.level * 2} contributions">
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    `;

        const totalEl = document.getElementById('contrib-total');
        if (totalEl) totalEl.textContent = `${totalContribs.toLocaleString()} contributions`;
    },

    renderCommits(events) {
        const container = document.getElementById('commits-list');
        if (!container) return;

        const pushEvents = events
            .filter(e => e.type === 'PushEvent' && e.payload?.commits?.length > 0)
            .slice(0, 8);

        if (pushEvents.length === 0) {
            container.innerHTML = `
        <div style="text-align:center; color: var(--text-muted); font-size:12px; padding:20px 0;">
          <span class="material-symbols-outlined" style="display:block; font-size:28px; margin-bottom:8px; opacity:0.3;">commit</span>
          No recent commits found
        </div>
      `;
            return;
        }

        container.innerHTML = pushEvents.map((event, i) => {
            const repoName = event.repo?.name?.split('/')[1] || event.repo?.name || 'Unknown';
            const commit = event.payload.commits[0];
            const msg = commit.message?.split('\n')[0] || '';
            const hash = commit.sha?.slice(0, 7) || '-------';
            const timeStr = utils.timeAgo(event.created_at);
            const { type, color, rest } = utils.formatCommitType(msg);

            const isVaried = i % 3 !== 0;

            return `
        <div class="commit-item" onclick="window.open('https://github.com/${event.repo?.name}', '_blank')">
          <div class="commit-meta">
            <span class="commit-repo ${isVaried ? 'varied' : ''}">${repoName}</span>
            <span class="commit-time">${timeStr}</span>
          </div>
          <div class="commit-msg">
            ${type ? `<span style="color:${color}; font-weight:700; margin-right:4px;">${type}:</span>` : ''}
            ${rest}
          </div>
          <div class="commit-hash">#${hash}</div>
        </div>
      `;
        }).join('');
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.GitHubWidget = GitHubWidget;
