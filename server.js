/**
 * Pi Dashboard — Express Backend
 * Runs on your Raspberry Pi 5 to serve system stats,
 * proxy Notion API, and serve the React build.
 *
 * Start: node server.js
 * Production: pm2 start server.js --name pi-dashboard
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── System Stats ─────────────────────────────────────────────────
function getCpuUsage() {
  try {
    const stat1 = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0].split(' ').slice(1).map(Number);
    return new Promise(resolve => {
      setTimeout(() => {
        const stat2 = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0].split(' ').slice(1).map(Number);
        const idle1 = stat1[3], total1 = stat1.reduce((a,b) => a+b, 0);
        const idle2 = stat2[3], total2 = stat2.reduce((a,b) => a+b, 0);
        const pct = 100 * (1 - (idle2 - idle1) / (total2 - total1));
        resolve(Math.round(pct));
      }, 500);
    });
  } catch { return Promise.resolve(0); }
}

function getMemUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100);
}

function getDiskUsage() {
  try {
    const out = execSync("df / --output=pcent | tail -1").toString().trim().replace('%','');
    return parseInt(out);
  } catch { return 0; }
}

function getCpuTemp() {
  try {
    const temp = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    return (parseInt(temp) / 1000).toFixed(1);
  } catch { return '55.0'; }
}

function getUptime() {
  const secs = os.uptime();
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

function getLocalIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return '127.0.0.1';
}

app.get('/api/system', async (req, res) => {
  try {
    const cpu = await getCpuUsage();
    res.json({
      cpu,
      mem: getMemUsage(),
      disk: getDiskUsage(),
      temp: getCpuTemp(),
      uptime: getUptime(),
      hostname: os.hostname(),
      os: 'Raspberry Pi OS 64-bit',
      ip: getLocalIp(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Notion Tasks Proxy ───────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  const token = process.env.REACT_APP_NOTION_TOKEN;
  const dbId  = process.env.REACT_APP_NOTION_DB_ID;

  if (!token || !dbId) {
    return res.status(400).json({ error: 'Notion not configured' });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Date',
          date: { equals: new Date().toISOString().split('T')[0] }
        }
      }),
    });
    const data = await response.json();
    const tasks = data.results.map((page, i) => ({
      id: i + 1,
      text: page.properties.Name?.title?.[0]?.text?.content || 'Untitled',
      done: page.properties.Done?.checkbox || false,
      priority: page.properties.Priority?.select?.name?.toLowerCase() || 'med',
      source: 'Notion',
    }));
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Serve React Build ────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🍓 Pi Dashboard server running on http://0.0.0.0:${PORT}`);
  console.log(`   Local network: http://${getLocalIp()}:${PORT}\n`);
});
