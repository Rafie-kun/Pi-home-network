/**
 * Pi5 Dashboard — Main App Controller
 * Bootstraps all widgets, handles settings, and coordinates data flow.
 */

const App = {
    _refreshTimeout: null,

    async init() {
        // Boot sequence
        utils.addLog('Dashboard initializing...', 'info');

        // Load config from localStorage into defaults
        this._mergeConfig();

        // Initialize settings panel UI
        this._setupSettings();

        // Show loading screen for 2.2 seconds (feels intentional, not just lag)
        await this._showLoading();

        // Reveal app
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');

        // Initialize all widgets (order matters for log cleanliness)
        LogWidget.init();
        ClockWidget.init();

        // Run async widgets concurrently for fast load
        await Promise.allSettled([
            WeatherWidget.init(),
            SystemWidget.init(),
            GitHubWidget.init(),
            TasksWidget.init(),
            NetworkWidget.init(),
            N8nWidget.init(),
            DockerWidget.init(),
        ]);

        // Misc UI setup
        this._setupNavigation();
        this._setupRefreshBtn();
        this._setupSearch();
        this._updateFooter();

        utils.addLog('All widgets loaded successfully', 'success');
        utils.showToast('Dashboard ready!', 'success', 2500);
    },

    _mergeConfig() {
        // The config.js sets defaults; localStorage values take precedence
        const saved = JSON.parse(localStorage.getItem('pi_dashboard_config') || '{}');

        // Merge services array (saved overrides default if present)
        window.PI_DASHBOARD_CONFIG = {
            ...window.PI_DASHBOARD_CONFIG,
            ...saved,
        };
    },

    async _showLoading() {
        return new Promise(resolve => setTimeout(resolve, 2200));
    },

    _setupSettings() {
        const openBtn = document.getElementById('open-settings');
        const modal = document.getElementById('settings-modal');
        const closeBtn = document.getElementById('settings-close');
        const saveBtn = document.getElementById('settings-save');
        const resetBtn = document.getElementById('settings-reset');

        if (openBtn) openBtn.onclick = () => {
            this._populateSettingsForm();
            modal.classList.remove('hidden');
        };

        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });

        if (saveBtn) saveBtn.onclick = () => this._saveSettings(modal);
        if (resetBtn) resetBtn.onclick = () => {
            if (confirm('Reset all settings to defaults?')) {
                localStorage.removeItem('pi_dashboard_config');
                utils.showToast('Settings reset to defaults. Reload to apply.', 'info');
                modal.classList.add('hidden');
            }
        };
    },

    _populateSettingsForm() {
        const cfg = utils.getConfig();
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        set('cfg-weather-key', cfg.weatherApiKey);
        set('cfg-city', cfg.city);
        set('cfg-github-user', cfg.githubUsername);
        set('cfg-github-token', cfg.githubToken);
        set('cfg-n8n-url', cfg.n8nUrl);
        set('cfg-n8n-key', cfg.n8nApiKey);
        set('cfg-pi-url', cfg.piApiUrl);
        set('cfg-pi-name', cfg.piHostname);
        set('cfg-notion-token', cfg.notionToken);
        set('cfg-notion-db', cfg.notionDatabaseId);
    },

    _saveSettings(modal) {
        const get = (id) => document.getElementById(id)?.value?.trim() || '';

        const newConfig = {
            weatherApiKey: get('cfg-weather-key'),
            city: get('cfg-city') || 'London',
            githubUsername: get('cfg-github-user') || 'your-username',
            githubToken: get('cfg-github-token'),
            n8nUrl: get('cfg-n8n-url'),
            n8nApiKey: get('cfg-n8n-key'),
            piApiUrl: get('cfg-pi-url'),
            piHostname: get('cfg-pi-name') || 'raspberrypi-node-05',
            notionToken: get('cfg-notion-token'),
            notionDatabaseId: get('cfg-notion-db'),
        };

        utils.saveConfig(newConfig);
        utils.showToast('Settings saved! Refreshing data...', 'success');
        utils.addLog('Configuration updated', 'info');
        modal.classList.add('hidden');

        // Re-initialize widgets with new config
        setTimeout(() => {
            WeatherWidget.refresh();
            GitHubWidget.refresh();
            N8nWidget.refresh();
            SystemWidget.refresh();
        }, 500);
    },

    _setupNavigation() {
        const links = document.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.id === 'open-n8n') return; // handled by n8n widget

                e.preventDefault();
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const section = link.dataset.section;
                if (section) {
                    utils.addLog(`Navigated to: ${section}`, 'info');
                }
            });
        });
    },

    _setupRefreshBtn() {
        const btn = document.getElementById('refresh-all');
        const icon = document.getElementById('refresh-icon');

        if (!btn) return;

        btn.onclick = async () => {
            icon.classList.add('spinning');
            btn.disabled = true;

            utils.addLog('Manual refresh triggered...', 'info');
            utils.showToast('Refreshing all widgets...', 'info', 2000);

            await Promise.allSettled([
                WeatherWidget.refresh(),
                SystemWidget.refresh(),
                GitHubWidget.refresh(),
                NetworkWidget.refresh(),
                N8nWidget.refresh(),
                DockerWidget.refresh(),
            ]);

            icon.classList.remove('spinning');
            btn.disabled = false;
            this._updateFooter();
            utils.showToast('All data refreshed!', 'success');
        };
    },

    _setupSearch() {
        const input = document.getElementById('widget-search');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const widgets = document.querySelectorAll('.widget');

            if (!query) {
                widgets.forEach(w => w.style.opacity = '1');
                return;
            }

            widgets.forEach(w => {
                const text = w.textContent.toLowerCase();
                w.style.opacity = text.includes(query) ? '1' : '0.3';
            });
        });

        // ESC to clear
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                input.value = '';
                document.querySelectorAll('.widget').forEach(w => w.style.opacity = '1');
                input.blur();
            }
        });
    },

    _updateFooter() {
        const el = document.getElementById('last-updated');
        if (el) {
            const now = new Date();
            el.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    },
};

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
