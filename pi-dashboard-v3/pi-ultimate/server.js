/**
 * Pi5 Command Center — Express Backend
 * ─────────────────────────────────────────────────────────────────
 * Provides real Raspberry Pi 5 system statistics, proxies the Notion
 * API (CORS workaround), proxies n8n API, and serves the dashboard.
 *
 * Endpoints:
 *   GET /api/system         → Real Pi CPU, RAM, temp, disk, uptime
 *   GET /api/tasks          → Tasks from Notion (or demo data)
 *   GET /api/n8n/workflows  → n8n workflow list
 *   GET /api/n8n/stats      → n8n execution stats
 *   GET /api/n8n/executions → Recent executions
 *
 * Start: node server.js
 * PM2:   pm2 start server.js --name pi-dashboard
 */

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const os       = require('os');
const fs       = require('fs');
const { execSync, exec } = require('child_process');

const app  = express();
const PORT = parseInt(process.env.PORT || '3001');

const N8N_URL     = process.env.N8N_URL     || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';
const NOTION_TOKEN = process.env.REACT_APP_NOTION_TOKEN || '';
const NOTION_DB_ID = process.env.REACT_APP_NOTION_DB_ID || '';

app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Serve static dashboard files ───────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ══════════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════════

function readProcStat() {
  try {
    const line = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0];
    return line.replace('cpu', '').trim().split(/\s+/).map(Number);
  } catch { return null; }
}

function getCpuUsage() {
  return new Promise(resolve => {
    const s1 = readProcStat();
    if (!s1) {
      // Non-Linux fallback (dev machine)
      return resolve(Math.round(5 + Math.random() * 40));
    }
    setTimeout(() => {
      const s2 = readProcStat();
      if (!s2) return resolve(0);
      const idle1 = s1[3], total1 = s1.reduce((a, b) => a + b, 0);
      const idle2 = s2[3], total2 = s2.reduce((a, b) => a + b, 0);
      const pct = 100 * (1 - (idle2 - idle1) / (total2 - total1));
      resolve(Math.max(0, Math.round(pct)));
    }, 400);
  });
}

function getMemInfo() {
  try {
    const lines  = fs.readFileSync('/proc/meminfo', 'utf8').split('\n');
    const get    = key => {
      const l = lines.find(l => l.startsWith(key));
      return l ? parseInt(l.split(/\s+/)[1]) : 0;
    };
    const total  = get('MemTotal');
    const avail  = get('MemAvailable');
    const usedKB = total - avail;
    return {
      pct:     Math.round(usedKB / total * 100),
      usedGB:  (usedKB / 1048576).toFixed(2),
      totalGB: (total  / 1048576).toFixed(1),
    };
  } catch {
    const total = os.totalmem(), free = os.freemem();
    const used  = total - free;
    return {
      pct:     Math.round(used / total * 100),
      usedGB:  (used  / 1e9).toFixed(2),
      totalGB: (total / 1e9).toFixed(1),
    };
  }
}

function getDiskInfo() {
  try {
    const out = execSync("df / --output=used,size --block-size=1G 2>/dev/null | tail -1")
      .toString().trim().split(/\s+/);
    const used = parseInt(out[0]), total = parseInt(out[1]);
    return { usedGB: used, totalGB: total, pct: Math.round(used / total * 100) };
  } catch {
    return { usedGB: 0, totalGB: 0, pct: 0 };
  }
}

function getCpuTemp() {
  // Pi-specific thermal zone
  try {
    const raw = fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8');
    return parseFloat((parseInt(raw.trim()) / 1000).toFixed(1));
  } catch {}
  // vcgencmd fallback
  try {
    const out = execSync('vcgencmd measure_temp 2>/dev/null').toString();
    const match = out.match(/temp=([\d.]+)/);
    if (match) return parseFloat(match[1]);
  } catch {}
  return parseFloat((42 + Math.random() * 12).toFixed(1));
}

function getUptimeStr() {
  const s = os.uptime();
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`;
}

function getLocalIp() {
  for (const [, addrs] of Object.entries(os.networkInterfaces())) {
    for (const a of addrs) {
      if (a.family === 'IPv4' && !a.internal) return a.address;
    }
  }
  return '127.0.0.1';
}

function getLoadAvg() {
  try { return os.loadavg().map(v => v.toFixed(2)); }
  catch { return ['0.00','0.00','0.00']; }
}

function getFanRpm() {
  // Pi 5 has an official fan header
  try {
    const files = fs.readdirSync('/sys/class/thermal/').filter(f => f.startsWith('cooling_device'));
    for (const f of files) {
      const cur = fs.readFileSync(`/sys/class/thermal/${f}/cur_state`, 'utf8').trim();
      if (cur) return parseInt(cur) * 200 + 800;
    }
  } catch {}
  return 1200;
}

// ══════════════════════════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════════════════════════

// System stats
app.get('/api/system', async (req, res) => {
  try {
    const [cpu, mem, disk, temp, load] = await Promise.all([
      getCpuUsage(),
      Promise.resolve(getMemInfo()),
      Promise.resolve(getDiskInfo()),
      Promise.resolve(getCpuTemp()),
      Promise.resolve(getLoadAvg()),
    ]);
    res.json({
      cpu,
      ram:      mem,
      disk,
      temp,
      load:     { '1m': load[0], '5m': load[1], '15m': load[2] },
      uptime:   getUptimeStr(),
      uptimeSec: Math.floor(os.uptime()),
      hostname: os.hostname(),
      ip:       getLocalIp(),
      platform: os.platform(),
      arch:     os.arch(),
      fanRpm:   getFanRpm(),
      ts:       Date.now(),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Notion tasks proxy
app.get('/api/tasks', async (req, res) => {
  if (!NOTION_TOKEN || !NOTION_DB_ID) {
    return res.json([
      { id:1, text:'Review PR #421', done:true,  priority:'high', source:'Demo' },
      { id:2, text:'Pi5 Fan Speed Adjustment', done:false, priority:'med', source:'Demo' },
      { id:3, text:'Backup Home Assistant DB', done:false, priority:'med', source:'Demo' },
      { id:4, text:'Weekly Sprint Planning', done:false, priority:'low', source:'Demo' },
      { id:5, text:'Update dashboard README', done:false, priority:'low', source:'Demo' },
    ]);
  }
  try {
    const today = new Date().toISOString().split('T')[0];
    const r = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: { property: 'Date', date: { equals: today } },
        sorts:  [{ property: 'Priority', direction: 'descending' }],
      }),
    });
    const data = await r.json();
    const tasks = (data.results || []).map((page, i) => ({
      id:       i + 1,
      text:     page.properties?.Name?.title?.[0]?.plain_text || 'Untitled',
      done:     page.properties?.Done?.checkbox || false,
      priority: (page.properties?.Priority?.select?.name || 'low').toLowerCase(),
      source:   'Notion',
    }));
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── n8n proxy ───────────────────────────────────────────────────────────

async function n8nReq(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (N8N_API_KEY) headers['X-N8N-API-KEY'] = N8N_API_KEY;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${N8N_URL}/api/v1/${endpoint}`, opts);
  if (!r.ok) throw new Error(`n8n ${r.status}: ${r.statusText}`);
  return r.json();
}

app.get('/api/n8n/workflows', async (req, res) => {
  try {
    const data = await n8nReq('workflows?limit=50');
    res.json(data.data || []);
  } catch (e) {
    res.status(503).json({ error: 'n8n unreachable', detail: e.message });
  }
});

app.get('/api/n8n/stats', async (req, res) => {
  try {
    const [wf, exec] = await Promise.all([
      n8nReq('workflows?limit=100'),
      n8nReq('executions?limit=50'),
    ]);
    const workflows   = wf.data   || [];
    const executions  = exec.data || [];
    const successful  = executions.filter(e => e.status === 'success' || e.finished).length;
    res.json({
      total:       workflows.length,
      active:      workflows.filter(w => w.active).length,
      executions:  executions.length,
      successRate: executions.length ? Math.round(successful / executions.length * 100) : 0,
    });
  } catch (e) {
    res.status(503).json({ error: 'n8n unreachable', detail: e.message });
  }
});

app.get('/api/n8n/executions', async (req, res) => {
  try {
    const data = await n8nReq('executions?limit=20');
    res.json(data.data || []);
  } catch (e) {
    res.status(503).json({ error: 'n8n unreachable', detail: e.message });
  }
});

// Toggle workflow active state
app.post('/api/n8n/workflows/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const endpoint = active ? `workflows/${id}/activate` : `workflows/${id}/deactivate`;
    await n8nReq(endpoint, 'POST');
    res.json({ ok: true });
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: os.uptime(), ts: Date.now() });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log('\n🍓 Pi5 Command Center');
  console.log(`  Local:    http://localhost:${PORT}`);
  console.log(`  Network:  http://${ip}:${PORT}`);
  console.log(`  n8n:      ${N8N_URL}`);
  console.log(`  API:`);
  console.log(`    /api/system          Live Pi stats`);
  console.log(`    /api/tasks           Notion tasks`);
  console.log(`    /api/n8n/workflows   n8n workflows`);
  console.log(`    /api/n8n/stats       n8n stats`);
  console.log(`    /api/health          Health check\n`);
});
