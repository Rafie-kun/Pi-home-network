/**
 * Pi5 Dashboard — API Layer
 * Handles all external API calls with fallback to realistic mock data.
 */

const API = {

    // ========== WEATHER ==========

    async getWeather() {
        const cfg = utils.getConfig();

        if (!cfg.weatherApiKey || !cfg.city) {
            return API._mockWeather(cfg.city || 'London');
        }

        try {
            const res = await utils.fetchWithTimeout(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cfg.city)}&appid=${cfg.weatherApiKey}&units=${cfg.weatherUnits}`
            );
            if (!res.ok) throw new Error(`Weather API ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('[API] Weather fallback:', e.message);
            utils.addLog(`Weather API error: ${e.message}`, 'warn');
            return API._mockWeather(cfg.city);
        }
    },

    async getWeatherForecast() {
        const cfg = utils.getConfig();

        if (!cfg.weatherApiKey || !cfg.city) {
            return API._mockForecast();
        }

        try {
            const res = await utils.fetchWithTimeout(
                `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cfg.city)}&appid=${cfg.weatherApiKey}&units=${cfg.weatherUnits}&cnt=5`
            );
            if (!res.ok) throw new Error(`Forecast API ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('[API] Forecast fallback:', e.message);
            return API._mockForecast();
        }
    },

    _mockWeather(city) {
        const conditions = [
            { id: 800, main: 'Clear', description: 'clear sky', icon: '01d', temp: 22, feels: 20, humidity: 45, wind: 12 },
            { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d', temp: 18, feels: 16, humidity: 60, wind: 8 },
            { id: 500, main: 'Rain', description: 'light rain', icon: '10d', temp: 14, feels: 12, humidity: 80, wind: 15 },
            { id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d', temp: 16, feels: 14, humidity: 70, wind: 10 },
        ];
        const c = conditions[Math.floor(Math.random() * conditions.length)];
        return {
            _isMock: true,
            name: city,
            main: { temp: c.temp, feels_like: c.feels, humidity: c.humidity },
            weather: [{ id: c.id, main: c.main, description: c.description, icon: c.icon }],
            wind: { speed: c.wind / 3.6 },
        };
    },

    _mockForecast() {
        const days = ['2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20'];
        const icons = ['01d', '02d', '10d', '04d', '01d'];
        const temps = [22, 19, 15, 17, 24];
        const mins = [14, 12, 10, 11, 16];
        return {
            _isMock: true,
            list: days.map((d, i) => ({
                dt_txt: `${d} 12:00:00`,
                main: { temp: temps[i], temp_min: mins[i], temp_max: temps[i] },
                weather: [{ id: i === 2 ? 500 : 800, icon: icons[i], description: 'partly cloudy' }],
            })),
        };
    },

    // ========== SYSTEM STATS (Pi API) ==========

    async getSystemStats() {
        const cfg = utils.getConfig();

        if (cfg.piApiUrl) {
            try {
                const res = await utils.fetchWithTimeout(`${cfg.piApiUrl}`);
                if (!res.ok) throw new Error(`Pi API ${res.status}`);
                return await res.json();
            } catch (e) {
                console.warn('[API] Pi stats fallback:', e.message);
            }
        }

        // Generate realistic-feeling mock data
        return API._mockSystemStats();
    },

    _mockSystemStats: (() => {
        // Persistent state for realistic simulation
        let cpu = 24, ram = 4.2, temp = 42, disk = 45;
        let netDown = 12.4, netUp = 4.1;

        return function () {
            // Slowly drift values for realism
            cpu = Math.max(5, Math.min(95, cpu + (Math.random() - 0.48) * 4));
            ram = Math.max(2.0, Math.min(7.5, ram + (Math.random() - 0.5) * 0.2));
            temp = Math.max(35, Math.min(80, temp + (Math.random() - 0.5) * 1.5));
            disk = Math.max(20, Math.min(90, disk + (Math.random() - 0.5) * 0.1));
            netDown = Math.max(0, Math.min(500, netDown + (Math.random() - 0.4) * 5));
            netUp = Math.max(0, Math.min(100, netUp + (Math.random() - 0.5) * 2));

            const uptimeSecs = Math.floor(Date.now() / 1000) - 1211000; // ~14 days ago

            return {
                _isMock: true,
                cpu: { percent: Math.round(cpu), cores: 4, freq: 2400 },
                ram: { used: parseFloat(ram.toFixed(1)), total: 8, percent: Math.round((ram / 8) * 100) },
                temperature: Math.round(temp),
                disk: { used: Math.round((disk / 100) * 128), total: 128, percent: Math.round(disk) },
                network: {
                    download: parseFloat(netDown.toFixed(1)),
                    upload: parseFloat(netUp.toFixed(1)),
                    ip: '192.168.1.104',
                    gateway: '192.168.1.1',
                    dns: '1.1.1.1',
                    type: 'Wi-Fi 6E',
                    security: 'WPA3',
                    ping: Math.round(Math.random() * 5 + 2),
                },
                uptime: uptimeSecs,
                hostname: utils.getConfig().piHostname || 'raspberrypi-node-05',
                fans: [{ label: 'CPU Fan', rpm: Math.round(1100 + (temp - 40) * 20) }],
            };
        };
    })(),

    // ========== GITHUB ==========

    async getGitHubUser() {
        const cfg = utils.getConfig();
        const username = cfg.githubUsername;

        if (!username || username === 'your-username') {
            return API._mockGitHubUser();
        }

        const headers = {};
        if (cfg.githubToken) {
            headers['Authorization'] = `Bearer ${cfg.githubToken}`;
        }

        try {
            const res = await utils.fetchWithTimeout(
                `https://api.github.com/users/${username}`, { headers }
            );
            if (!res.ok) throw new Error(`GitHub API ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('[API] GitHub user fallback:', e.message);
            utils.addLog(`GitHub API error: ${e.message}`, 'warn');
            return API._mockGitHubUser();
        }
    },

    async getGitHubRepos() {
        const cfg = utils.getConfig();
        const username = cfg.githubUsername;

        if (!username || username === 'your-username') {
            return API._mockGitHubRepos();
        }

        const headers = {};
        if (cfg.githubToken) {
            headers['Authorization'] = `Bearer ${cfg.githubToken}`;
        }

        try {
            const res = await utils.fetchWithTimeout(
                `https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`, { headers }
            );
            if (!res.ok) throw new Error(`GitHub Repos ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('[API] GitHub repos fallback:', e.message);
            return API._mockGitHubRepos();
        }
    },

    async getGitHubEvents() {
        const cfg = utils.getConfig();
        const username = cfg.githubUsername;

        if (!username || username === 'your-username') {
            return API._mockGitHubEvents();
        }

        const headers = {};
        if (cfg.githubToken) {
            headers['Authorization'] = `Bearer ${cfg.githubToken}`;
        }

        try {
            const res = await utils.fetchWithTimeout(
                `https://api.github.com/users/${username}/events?per_page=15`, { headers }
            );
            if (!res.ok) throw new Error(`GitHub Events ${res.status}`);
            return await res.json();
        } catch (e) {
            console.warn('[API] GitHub events fallback:', e.message);
            return API._mockGitHubEvents();
        }
    },

    _mockGitHubUser() {
        return {
            _isMock: true,
            login: 'pi-developer',
            name: 'Pi Developer',
            bio: '🥧 Raspberry Pi enthusiast | Full-Stack Dev | Open Source',
            avatar_url: '',
            public_repos: 42,
            followers: 892,
            following: 156,
            public_gists: 18,
        };
    },

    _mockGitHubRepos() {
        return [
            { name: 'pi5-dashboard', stargazers_count: 234, language: 'JavaScript', pushed_at: new Date(Date.now() - 2 * 3600000).toISOString() },
            { name: 'home-automation', stargazers_count: 891, language: 'Python', pushed_at: new Date(Date.now() - 5 * 3600000).toISOString() },
            { name: 'dotfiles', stargazers_count: 156, language: 'Shell', pushed_at: new Date(Date.now() - 24 * 3600000).toISOString() },
            { name: 'nextjs-portfolio', stargazers_count: 445, language: 'TypeScript', pushed_at: new Date(Date.now() - 48 * 3600000).toISOString() },
        ].map(r => ({ ...r, _isMock: true }));
    },

    _mockGitHubEvents() {
        const repos = ['pi5-dashboard', 'home-automation', 'dotfiles', 'nextjs-portfolio', 'n8n-workflows'];
        const messages = [
            'feat: implement glassmorphism bento grid',
            'fix: handle WebSocket reconnection timeout',
            'chore: update dependencies and clean up types',
            'feat: add n8n workflow integration panel',
            'docs: update Pi 5 setup and install guide',
            'refactor: extract API layer from components',
            'fix: correct temperature gauge calculation',
            'feat: add dark/light mode toggle',
            'perf: optimize SVG gauge rendering',
            'style: improve mobile responsive layout',
        ];

        const events = [];
        let timeOffset = 0;
        for (let i = 0; i < 10; i++) {
            timeOffset += Math.floor(Math.random() * 14400000 + 1800000); // 0.5-4hr gaps
            events.push({
                _isMock: true,
                type: 'PushEvent',
                repo: { name: `user/${repos[Math.floor(Math.random() * repos.length)]}` },
                created_at: new Date(Date.now() - timeOffset).toISOString(),
                payload: {
                    commits: [{ message: messages[i], sha: Math.random().toString(16).slice(2, 9) }]
                }
            });
        }
        return events;
    },

    // ========== N8N ==========

    async getN8nWorkflows() {
        const cfg = utils.getConfig();

        if (cfg.n8nUrl && cfg.n8nApiKey) {
            try {
                const res = await utils.fetchWithTimeout(
                    `${cfg.n8nUrl}/api/v1/workflows`,
                    {
                        headers: {
                            'X-N8N-API-KEY': cfg.n8nApiKey,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                if (!res.ok) throw new Error(`n8n API ${res.status}`);
                const data = await res.json();
                return data.data || data;
            } catch (e) {
                console.warn('[API] n8n fallback:', e.message);
                utils.addLog(`n8n not reachable: ${e.message}`, 'warn');
            }
        }

        return API._mockN8nWorkflows();
    },

    async triggerN8nWorkflow(webhookUrl) {
        try {
            const res = await utils.fetchWithTimeout(webhookUrl, { method: 'POST' });
            return res.ok;
        } catch (e) {
            console.warn('[API] n8n trigger failed:', e.message);
            return false;
        }
    },

    _mockN8nWorkflows() {
        return [
            {
                id: '1', _isMock: true,
                name: 'Daily GitHub Backup',
                active: true,
                description: 'Backs up all repos to local NAS every night at 2AM',
                nodes: 6, executions: 142,
                updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                webhookUrl: null,
            },
            {
                id: '2', _isMock: true,
                name: 'Home Assistant Alerts',
                active: true,
                description: 'Sends Telegram notifications for sensor triggers',
                nodes: 4, executions: 891,
                updatedAt: new Date(Date.now() - 86400000).toISOString(),
                webhookUrl: null,
            },
            {
                id: '3', _isMock: true,
                name: 'Weekly Report Generator',
                active: false,
                description: 'Generates PDF report of system stats and emails it',
                nodes: 8, executions: 24,
                updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
                webhookUrl: null,
            },
            {
                id: '4', _isMock: true,
                name: 'Pi Health Monitor',
                active: true,
                description: 'Alerts if CPU temp exceeds 75°C or disk > 85%',
                nodes: 5, executions: 1204,
                updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
                webhookUrl: null,
            },
            {
                id: '5', _isMock: true,
                name: 'Notion → Tasks Sync',
                active: false,
                description: 'Syncs Notion database tasks to dashboard every hour',
                nodes: 7, executions: 168,
                updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
                webhookUrl: null,
            },
            {
                id: '6', _isMock: true,
                name: 'Docker Auto-Update',
                active: true,
                description: 'Pulls latest images and restarts containers on Sunday',
                nodes: 10, executions: 56,
                updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
                webhookUrl: null,
            },
        ];
    },

    // ========== DOCKER CONTAINERS ==========

    async getContainers() {
        const cfg = utils.getConfig();

        if (cfg.piApiUrl) {
            try {
                const res = await utils.fetchWithTimeout(`${cfg.piApiUrl.replace('/stats', '')}/containers`);
                if (!res.ok) throw new Error(`Containers API ${res.status}`);
                return await res.json();
            } catch (e) {
                // Fallback silently
            }
        }

        return API._mockContainers();
    },

    _mockContainers() {
        return [
            { id: '1', name: 'homeassistant', status: 'running', port: '8123', image: 'ghcr.io/home-assistant/home-assistant', _isMock: true },
            { id: '2', name: 'portainer', status: 'running', port: '9000', image: 'portainer/portainer-ce', _isMock: true },
            { id: '3', name: 'n8n', status: 'running', port: '5678', image: 'n8nio/n8n', _isMock: true },
            { id: '4', name: 'nginx-proxy', status: 'running', port: '80', image: 'jc21/nginx-proxy-manager', _isMock: true },
            { id: '5', name: 'grafana', status: 'running', port: '3000', image: 'grafana/grafana', _isMock: true },
            { id: '6', name: 'adguardhome', status: 'stopped', port: '3001', image: 'adguard/adguardhome', _isMock: true },
        ];
    },
};

window.API = API;
