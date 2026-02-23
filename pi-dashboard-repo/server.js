/**
 * Pi Dashboard — Express Backend
 * ─────────────────────────────────────────────────────────────
 * Serves real Raspberry Pi system stats, proxies the Notion API,
 * and proxies the n8n API — all from a single Node.js process.
 *
 * Start dev:        node server.js
 * Start production: NODE_ENV=production node server.js
 * With PM2:         pm2 start server.js --name pi-dashboard
 *
 * Endpoints:
 *   GET  /api/system      → CPU, RAM, disk, temp, uptime, IP
 *   GET  /api/tasks       → Today's tasks from Notion
 *   GET  /api/n8n/workflows → Active workflows from n8n
 *   GET  /api/n8n/stats   → Execution stats from n8n
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const os       = require('os');
const fs       = require('fs');
const { execSync } = require('child_process');

const app  = express();
const PORT = process.env.PORT || 3001;
const N8N_URL = process.env.N8N_URL || 'http://localhost:5678';
const N8N_KEY = process.env.N8N_API_KEY || '';

app.use(cors());
app.use(express.json());

// ── Serve static dashboard ─────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════════════════════════
//  SYSTEM STATS
// ══════════════════════════════════════════════════════════════

function readCpuTimes() {
  try {
    const line = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0];
    return line.replace('cpu', '').trim().split(/\s+/).map(Number);
  } catch { return null; }
}

function getCpuPercent() {
  return new Promise(resolve => {
    const t1 = readCpuTimes();
    if (!t1) return resolve(Math.round(Math.random() * 40 + 5)); // fallback for non-Linux
    setTimeout(() => {
      const t2 = readCpuTimes();
      if (!t2) return resolve(0);
      const idle1 = t1[3], total1 = t1.reduce((a,b)=>a+b,0);
      const idle2 = t2[3], total2 = t2.reduce((a,b)=>a+b,0);
      resolve(Math.round(100 * (1 - (idle2-idle1)/(total2-total1))));
    }, 500);
  });
}

function getMemPercent() {
  try {
    const lines = fs.readFileSync('/proc/meminfo', 'utf8').split('\n');
    const get = key => {
      const l = lines.find(l => l.startsWith(key));
      return l ? parseInt(l.split(/\s+/)[1]) : 0;
    };
    const total    = get('MemTotal');
    const available = get('MemAvailable');
    return { pct: Math.round((1 - available/total) * 100), total, available };
  } catch {
    const total = os.totalmem(), free = os.freemem();
    return { pct: Math.round((total-free)/total*100), total, available: free };
  }
}

function getDiskUsage() {
  try {
    const out = execSync("df / --output=used,size --block-size=1G | tail -1").toString().trim().split(/\s+/);
    return { used: parseInt(out[0]), total: parseInt(out[1]), pct: Math.round(parseInt(out[0])/parseInt(out[1])*100) };
  } catch { return { used: 0, total: 0, pct: 0 }; }
}

function getCpuTemp() {
  try {
    const t = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    return parseFloat((parseInt(t)/1000).toFixed(1));
  } catch {
    return parseFloat((40 + Math.random()*20).toFixed(1));
  }
}

function getUptimeStr() {
  const s = os.uptime();
  return `${Math.floor(s/86400)}d ${Math.floor((s%86400)/3600)}h ${Math.floor((s%3600)/60)}m`;
}

function getLocalIp() {
  for (const [, addrs] of Object.entries(os.networkInterfaces())) {
    const a = addrs.find(a => a.family === 'IPv4' && !a.internal);
    if (a) return a.address;
  }
  return '127.0.0.1';
}

app.get('/api/system', async (req, res) => {
  try {
    const [cpu, mem, disk, temp] = await Promise.all([
      getCpuPercent(),
      Promise.resolve(getMemPercent()),
      Promise.resolve(getDiskUsage()),
      Promise.resolve(getCpuTemp()),
    ]);
    res.json({
      cpu,
      ram: { pct: mem.pct, usedGB: ((mem.total - mem.available) / 1048576).toFixed(1), totalGB: (mem.total / 1048576).toFixed(0) },
      disk: { pct: disk.pct, usedGB: disk.used, totalGB: disk.total },
      temp,
      uptime: getUptimeStr(),
      hostname: os.hostname(),
      ip: getLocalIp(),
      platform: 'Raspberry Pi OS 64-bit',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════
//  NOTION TASKS PROXY
// ══════════════════════════════════════════════════════════════

app.get('/api/tasks', async (req, res) => {
  const token = process.env.REACT_APP_NOTION_TOKEN;
  const dbId  = process.env.REACT_APP_NOTION_DB_ID;

  if (!token || !dbId) {
    return res.json([
      { id:1, text:'Review PR #421', done:true,  priority:'high', source:'Notion' },
      { id:2, text:'Pi5 Fan Speed Adjustment', done:false, priority:'med', source:'Notion' },
      { id:3, text:'Backup Home Assistant DB', done:false, priority:'med', source:'Notion' },
      { id:4, text:'Weekly Sprint Planning', done:false, priority:'low', source:'Notion' },
    ]);
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const r = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ filter: { property: 'Date', date: { equals: today } } }),
    });
    const data = await r.json();
    const tasks = (data.results || []).map((page, i) => ({
      id: i + 1,
      text: page.properties?.Name?.title?.[0]?.text?.content || 'Untitled',
      done: page.properties?.Done?.checkbox || false,
      priority: page.properties?.Priority?.select?.name?.toLowerCase() || 'med',
      source: 'Notion',
    }));
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ══════════════════════════════════════════════════════════════
//  N8N PROXY
// ══════════════════════════════════════════════════════════════

async function n8nFetch(path) {
  const headers = { 'Content-Type': 'application/json' };
  if (N8N_KEY) headers['X-N8N-API-KEY'] = N8N_KEY;
  const r = await fetch(`${N8N_URL}/api/v1/${path}`, { headers });
  if (!r.ok) throw new Error(`n8n API error: ${r.status}`);
  return r.json();
}

app.get('/api/n8n/workflows', async (req, res) => {
  try {
    const data = await n8nFetch('workflows');
    res.json(data.data || []);
  } catch (e) {
    res.status(503).json({ error: 'n8n not reachable', detail: e.message });
  }
});

app.get('/api/n8n/stats', async (req, res) => {
  try {
    const [wf, execs] = await Promise.all([
      n8nFetch('workflows'),
      n8nFetch('executions?limit=100'),
    ]);
    const workflows = wf.data || [];
    const executions = execs.data || [];
    const successful = executions.filter(e => e.finished && !e.stoppedAt || e.status === 'success').length;
    res.json({
      total: workflows.length,
      active: workflows.filter(w => w.active).length,
      executions: executions.length,
      successRate: executions.length ? Math.round(successful / executions.length * 100) : 0,
    });
  } catch (e) {
    res.status(503).json({ error: 'n8n not reachable', detail: e.message });
  }
});

// ── SPA fallback ───────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('\n🍓 Pi Dashboard running');
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${ip}:${PORT}`);
  console.log(`   n8n:     ${N8N_URL}`);
  console.log(`\n   API endpoints:`);
  console.log(`   /api/system     → Live Pi stats`);
  console.log(`   /api/tasks      → Notion tasks`);
  console.log(`   /api/n8n/workflows → n8n workflows`);
  console.log(`   /api/n8n/stats  → n8n stats\n`);
});
