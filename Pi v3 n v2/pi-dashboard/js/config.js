/**
 * Pi5 Dashboard — Configuration
 * Edit this file OR use the Settings panel in the UI.
 * Settings saved in localStorage override these defaults.
 */

window.PI_DASHBOARD_CONFIG = {
  // === Weather ===
  // Get a free key at: https://openweathermap.org/api
  weatherApiKey: '',
  city: 'London',
  weatherUnits: 'metric', // 'metric' (°C) or 'imperial' (°F)

  // === GitHub ===
  // Get token at: https://github.com/settings/tokens
  githubUsername: 'your-username',
  githubToken: '',     // Personal access token (optional, higher rate limits)

  // === Pi System Stats API ===
  // Run the included server.js on your Pi, or leave blank for mock data
  piApiUrl: '',        // e.g. 'http://raspberrypi.local:3001/api/stats'
  piHostname: 'raspberrypi-node-05',

  // === n8n Integration ===
  // Run n8n locally or on Pi: https://n8n.io
  n8nUrl: '',          // e.g. 'http://localhost:5678'
  n8nApiKey: '',       // Found in n8n → Settings → API

  // === Notion (optional task sync) ===
  notionToken: '',     // Integration token
  notionDatabaseId: '', // Database ID from Notion URL

  // === Dashboard Behaviour ===
  refreshIntervalMs: 30000,   // How often to refresh live data (ms)
  weatherRefreshMs: 300000,   // Weather refresh (5 min)
  githubRefreshMs: 600000,    // GitHub refresh (10 min)
  enableDemoMode: true,       // Use realistic mock data when APIs unavailable

  // === Network Services to Monitor ===
  services: [
    { name: 'Home Assistant', port: 8123, color: '#f97316' },
    { name: 'Portainer',      port: 9000, color: '#06b6d4' },
    { name: 'n8n',            port: 5678, color: '#f97316' },
    { name: 'Grafana',        port: 3000, color: '#fb923c' },
    { name: 'Nginx Proxy',    port: 81,   color: '#10b981' },
    { name: 'AdGuard',        port: 3000, color: '#3b82f6' },
    { name: 'Pi-hole',        port: 80,   color: '#a855f7' },
    { name: 'Jellyfin',       port: 8096, color: '#8b5cf6' },
  ],
};
