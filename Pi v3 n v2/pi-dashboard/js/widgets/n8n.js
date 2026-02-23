/**
 * n8n Widget — Workflow manager and trigger panel
 */
const N8nWidget = {
    _workflows: [],
    _interval: null,

    async init() {
        await this.refresh();
        this._setupModal();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), cfg.refreshIntervalMs || 30000);
        utils.addLog('n8n widget initialized', 'info');
    },

    async refresh() {
        try {
            this._workflows = await API.getN8nWorkflows();
            this.renderMini();
            this.updateStatus();
        } catch (e) {
            utils.addLog(`n8n refresh error: ${e.message}`, 'error');
        }
    },

    updateStatus() {
        const dot = document.getElementById('n8n-dot');
        const text = document.getElementById('n8n-status-text');
        const indicator = document.querySelector('.n8n-online-indicator');
        const cfg = utils.getConfig();

        const hasCfg = !!(cfg.n8nUrl && cfg.n8nApiKey);
        const activeCount = this._workflows.filter(w => w.active).length;

        if (!hasCfg) {
            if (dot) dot.className = 'status-dot yellow';
            if (text) text.textContent = `Demo mode — ${activeCount} example workflows`;
            if (indicator) indicator.style.borderColor = 'rgba(234,179,8,0.2)';
        } else {
            if (dot) { dot.className = 'status-dot green pulse'; }
            if (text) text.textContent = `Connected — ${activeCount} active`;
            if (indicator) indicator.style.borderColor = 'rgba(57,255,20,0.2)';
        }
    },

    renderMini() {
        const container = document.getElementById('n8n-workflows-mini');
        if (!container) return;

        const items = this._workflows.slice(0, 4);

        container.innerHTML = items.map(wf => `
      <div class="n8n-workflow-item" onclick="N8nWidget._openModal()">
        <div class="status-dot ${wf.active ? 'green' : 'red'}"></div>
        <span class="n8n-workflow-name">${wf.name}</span>
        ${wf.active ? `
          <button class="n8n-trigger-btn" 
                  onclick="event.stopPropagation(); N8nWidget.triggerWorkflow('${wf.id}', '${wf.name}', this)"
                  title="Run workflow">
            <span class="material-symbols-outlined">play_arrow</span>
          </button>
        ` : `
          <span style="font-size:10px; color:var(--text-muted); padding:0 4px;">off</span>
        `}
      </div>
    `).join('');
    },

    async triggerWorkflow(id, name, btn) {
        const cfg = utils.getConfig();

        if (!cfg.n8nUrl) {
            utils.showToast(`Demo: Would run "${name}" workflow`, 'info');
            utils.addLog(`n8n workflow triggered (demo): ${name}`, 'info');

            // Visual feedback
            if (btn) {
                const icon = btn.querySelector('.material-symbols-outlined');
                if (icon) {
                    icon.textContent = 'check';
                    btn.style.background = 'rgba(57,255,20,0.2)';
                    setTimeout(() => {
                        icon.textContent = 'play_arrow';
                        btn.style.background = '';
                    }, 2000);
                }
            }
            return;
        }

        const wf = this._workflows.find(w => w.id === id);
        if (!wf?.webhookUrl) {
            utils.showToast('No webhook URL configured for this workflow', 'warning');
            return;
        }

        utils.showToast(`Triggering "${name}"...`, 'info');
        const ok = await API.triggerN8nWorkflow(wf.webhookUrl);

        if (ok) {
            utils.showToast(`"${name}" triggered successfully!`, 'success');
            utils.addLog(`n8n workflow executed: ${name}`, 'success');
        } else {
            utils.showToast(`Failed to trigger "${name}"`, 'error');
            utils.addLog(`n8n trigger failed: ${name}`, 'error');
        }
    },

    _setupModal() {
        const openBtn = document.getElementById('open-n8n-modal');
        const navBtn = document.getElementById('open-n8n');
        const modal = document.getElementById('n8n-modal');
        const closeBtn = document.getElementById('n8n-close');

        if (openBtn) openBtn.onclick = () => this._openModal();
        if (navBtn) navBtn.addEventListener('click', (e) => { e.preventDefault(); this._openModal(); });
        if (closeBtn) closeBtn.onclick = () => modal?.classList.add('hidden');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
    },

    _openModal() {
        const modal = document.getElementById('n8n-modal');
        const body = document.getElementById('n8n-modal-body');
        if (!modal || !body) return;

        const cfg = utils.getConfig();

        body.innerHTML = `
      <!-- n8n Quick Start Banner -->
      ${!cfg.n8nUrl ? `
        <div style="background:rgba(249,115,22,0.08); border:1px solid rgba(249,115,22,0.2); border-radius:var(--radius); padding:16px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span class="material-symbols-outlined" style="color:var(--neon-orange)">info</span>
            <strong style="font-size:13px;">Demo Mode — Configure n8n to connect</strong>
          </div>
          <p style="font-size:12px; color:var(--text-muted); line-height:1.6;">
            Open <strong>Settings ⚙️</strong> and enter your n8n URL + API Key to see real workflows. 
            Install n8n on your Pi with: <code style="background:rgba(0,0,0,0.3); padding:2px 6px; border-radius:4px;">npm install n8n -g && n8n</code>
          </p>
        </div>
      ` : ''}

      <!-- Workflow Grid -->
      <h3 style="font-size:13px; font-weight:700; margin-bottom:14px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">
        ${this._workflows.filter(w => w.active).length} Active / ${this._workflows.length} Total Workflows
      </h3>

      <div class="n8n-modal-grid">
        ${this._workflows.map(wf => `
          <div class="n8n-workflow-card ${wf.active ? 'active-card' : ''}">
            <div class="n8n-card-header">
              <div class="n8n-card-name">${wf.name}</div>
              <div class="n8n-card-status ${wf.active ? 'active' : 'inactive'}">
                ${wf.active ? '● Active' : '○ Inactive'}
              </div>
            </div>
            <div class="n8n-card-desc">${wf.description || 'No description'}</div>
            <div class="n8n-card-meta">
              <span><span class="material-symbols-outlined">account_tree</span> ${wf.nodes || '?'} nodes</span>
              <span><span class="material-symbols-outlined">play_arrow</span> ${wf.executions || 0} runs</span>
              <span><span class="material-symbols-outlined">schedule</span> ${utils.timeAgo(wf.updatedAt)}</span>
            </div>
            <div class="n8n-card-actions">
              ${wf.active ? `
                <button class="n8n-btn run" onclick="N8nWidget.triggerWorkflow('${wf.id}', '${wf.name}', this)">
                  ▶ Run Now
                </button>
              ` : `
                <button class="n8n-btn" disabled style="opacity:0.4; cursor:not-allowed;">Disabled</button>
              `}
              <button class="n8n-btn" onclick="window.open('${cfg.n8nUrl || 'http://localhost:5678'}', '_blank')">
                Open n8n
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- n8n Setup Guide -->
      <details style="margin-top:20px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius); padding:14px;">
        <summary style="cursor:pointer; font-size:13px; font-weight:700; display:flex; align-items:center; gap:6px; list-style:none;">
          <span class="material-symbols-outlined" style="font-size:16px; color:var(--primary)">help</span>
          How to Install & Connect n8n on Raspberry Pi 5
        </summary>
        <div style="margin-top:14px; font-size:12px; color:var(--text-secondary); line-height:1.8;">
          <p><strong style="color:var(--text-primary);">1. Install Node.js on Pi:</strong></p>
          <pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; margin:6px 0; overflow-x:auto; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--neon-green);">curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs</pre>

          <p><strong style="color:var(--text-primary);">2. Install n8n:</strong></p>
          <pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; margin:6px 0; overflow-x:auto; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--neon-green);">npm install -g n8n</pre>

          <p><strong style="color:var(--text-primary);">3. Start n8n (or use Docker):</strong></p>
          <pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; margin:6px 0; overflow-x:auto; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--neon-green);"># Direct
n8n start

# With Docker (recommended)
docker run -it --rm \\
  --name n8n \\
  -p 5678:5678 \\
  -v ~/.n8n:/home/node/.n8n \\
  n8nio/n8n</pre>

          <p><strong style="color:var(--text-primary);">4. Get your API key:</strong></p>
          <p style="color:var(--text-muted);">Go to n8n → Settings → API → Create an API key</p>

          <p><strong style="color:var(--text-primary);">5. Configure this dashboard:</strong></p>
          <p style="color:var(--text-muted);">Open Settings (⚙️) and enter your n8n URL (e.g. <code style="background:rgba(0,0,0,0.2); padding:1px 4px; border-radius:3px;">http://192.168.1.104:5678</code>) and paste your API key.</p>

          <div style="margin-top:12px; padding:10px; background:rgba(13,89,242,0.08); border:1px solid rgba(13,89,242,0.15); border-radius:6px;">
            <strong style="color:var(--primary);">💡 Tip:</strong> Add n8n as a systemd service so it starts on boot:
            <pre style="margin-top:6px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--neon-green);">sudo systemctl enable n8n && sudo systemctl start n8n</pre>
          </div>
        </div>
      </details>
    `;

        modal.classList.remove('hidden');
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.N8nWidget = N8nWidget;
