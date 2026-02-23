<div align="center">

# 🍓 Pi5 Command Center

**Full-stack self-hosted dashboard for Raspberry Pi 5**

Live system vitals · GitHub stats · n8n Automation Hub · Simulated Terminal · Pi OS + n8n guides

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pi 5](https://img.shields.io/badge/Raspberry%20Pi-5-red?logo=raspberrypi&logoColor=white)](https://raspberrypi.com)
[![n8n](https://img.shields.io/badge/n8n-Automation-orange)](https://n8n.io)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)](https://nodejs.org)
[![Self Hosted](https://img.shields.io/badge/Self--Hosted-✓-brightgreen)](#)

</div>

---

## ✨ What's Inside

| Tab | Features |
|-----|----------|
| **Dashboard** | ⏱ Live clock · 🌤 Weather · ⚡ CPU/RAM/Temp gauges · 🐙 GitHub · 📝 Commits · ✅ Tasks · 🌐 Network sparkline |
| **n8n Hub** | ⚡ Workflow manager · ➕ Add apps · ▶ Start/Pause · 🔍 Search/filter · 📋 Execution log · 🎯 Quick templates |
| **Terminal** | 💻 Simulated Pi terminal · Quick command buttons · Command history (↑↓) · Realistic Pi responses |
| **Guide** | 🍓 Pi OS install · 🚀 First boot · 🔐 SSH setup · 🐳 Docker · 💻 OS commands · ⚡ n8n install & workflows · 📡 Deployment |

---

## 🚀 Quick Start

### 1. Clone
```bash
git clone https://github.com/Rafie-kun/pi-dashboard.git
cd pi-dashboard
```

### 2. Configure
```bash
cp .env.example .env
nano .env  # fill in your API keys
```

### 3. Run

**Option A — Instant (no install, open in browser):**
```bash
open public/index.html
```

**Option B — With real Pi stats (recommended):**
```bash
npm install
node server.js
# → http://localhost:3001
# → http://YOUR_PI_IP:3001  (from any device)
```

**Option C — Production with PM2:**
```bash
sudo npm install -g pm2
NODE_ENV=production pm2 start server.js --name pi-dashboard
pm2 startup && pm2 save
```

---

## ⚙️ Configuration (.env)

```env
# GitHub (required for GitHub widget)
REACT_APP_GITHUB_USERNAME=Rafie-kun
REACT_APP_GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Weather (free key from openweathermap.org)
REACT_APP_WEATHER_KEY=your_key
REACT_APP_WEATHER_CITY=London

# Notion tasks (optional)
REACT_APP_NOTION_TOKEN=secret_xxx
REACT_APP_NOTION_DB_ID=your_db_id

# n8n (your Pi's IP)
N8N_URL=http://192.168.1.100:5678
N8N_API_KEY=your_n8n_api_key

PORT=3001
```

> **No API keys?** The dashboard runs in demo mode with animated simulated data — still looks great for portfolio screenshots!

---

## ⚡ Setting Up n8n

### Install with Docker (recommended)
```bash
mkdir -p ~/n8n-data

docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v ~/n8n-data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=yourpassword \
  -e WEBHOOK_URL=http://YOUR_PI_IP:5678 \
  docker.n8n.io/n8nio/n8n
```

Then open: `http://YOUR_PI_IP:5678`

### Adding Workflows from the Dashboard
1. Click **⚡ Automations** tab
2. Click **＋ Add Workflow** or pick a Quick Template from the sidebar
3. Fill in name, icon, category, and webhook URL
4. Click **⚡ Add Workflow** — it appears in the grid immediately
5. Use ▶ Start / ⏸ Pause / 🗑 Delete to manage

### Pre-built Quick Templates
| Template | Trigger | What it does |
|----------|---------|-------------|
| 💬 Discord Alert | Event | CPU/temp alerts to Discord |
| 🐙 GitHub Watcher | Cron | PR/CI notifications via Telegram |
| 🏠 Home Assistant | MQTT | Sync Pi metrics to HA |
| ✈️ Telegram Bot | Webhook | Two-way Telegram commands |
| 📰 RSS Digest | Cron | Daily tech news email at 8am |
| 🛡️ Pi-hole Stats | Cron | Block stats to dashboard |
| 📡 Uptime Monitor | Cron | Ping services, alert on downtime |
| 💾 Nightly Backup | Cron | Configs → GitHub Gist at 2am |

---

## 🍓 Pi OS Setup Guide

The **📖 Guide** tab has everything, but here's a quick reference:

### Flash Pi OS
1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Device → **Raspberry Pi 5**
3. OS → **Raspberry Pi OS (64-bit)**
4. Click ⚙️ → set hostname, username, password, Wi-Fi, enable SSH
5. Write to microSD → insert into Pi 5 → boot

### First SSH Connection
```bash
ssh pi@raspberrypi.local
# Or: ssh pi@192.168.1.XXX
```

### Essential First Commands
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nodejs npm
sudo npm install -g pm2
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

---

## 🖥️ JavaScript Architecture

The dashboard is built as a **modular vanilla JS application** with no framework dependencies:

```
CFG         → global config (API keys, URLs)
Page        → tab/page manager
Clock       → real-time clock with timezone detection
API         → fetch() wrapper for all external calls
Dashboard   → widget rendering engine
  ├─ loadSystem()   → real Pi stats via /api/system
  ├─ updateGauges() → SVG arc animation engine
  ├─ loadGitHub()   → GitHub REST API
  ├─ buildContribs()→ contribution heatmap generator
  ├─ renderCommits()→ commit timeline
  └─ loadTasks()    → Notion API tasks
N8N         → automation hub module
  ├─ render()       → apps grid + stats
  ├─ toggle()       → start/pause workflows
  ├─ addApp()       → add custom workflow
  ├─ startLogFeed() → live execution log simulation
  └─ filter()       → search + status filter
Term        → simulated Pi terminal
  └─ exec()         → command parser + responder
Guide       → documentation nav
```

---

## 🗂️ Project Structure

```
pi-dashboard/
├── public/
│   └── index.html       ← Complete dashboard (open directly!)
├── server.js            ← Express backend (real Pi stats + n8n proxy)
├── .env.example         ← Config template
├── .gitignore
├── package.json
└── README.md
```

---

## 📡 API Endpoints (server.js)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/system` | CPU %, RAM, disk, temp, uptime, IP |
| GET | `/api/tasks` | Today's tasks from Notion (or demo) |
| GET | `/api/n8n/workflows` | List all n8n workflows |
| GET | `/api/n8n/stats` | Active count, execution rate |
| GET | `/api/n8n/executions` | Recent execution history |
| POST | `/api/n8n/workflows/:id/toggle` | Activate/deactivate workflow |
| GET | `/api/health` | Server health check |

---

## 🚢 Deploy on Pi

```bash
# Static only (Python, no install)
python3 -m http.server 8080 --directory public

# Full stack (real stats)
npm install && node server.js

# PM2 production
NODE_ENV=production pm2 start server.js --name pi-dashboard
pm2 startup && pm2 save

# Access from anywhere on your network:
# http://YOUR_PI_IP:3001
```

### Push to GitHub Pages (live demo)
```bash
git subtree push --prefix public origin gh-pages
# Enable GitHub Pages → gh-pages branch in Settings
```

---

## 🎨 Customization

Edit CSS variables at the top of `public/index.html`:
```css
:root {
  --blue:   #40b0ff;   /* Primary accent */
  --green:  #1deb8a;   /* Live/success */
  --orange: #ff8533;   /* Warning / temp */
  --purple: #b57bff;   /* n8n accent */
  --cyan:   #00d4ff;   /* Secondary */
}
```

Edit the `CFG` object in the `<script>` section:
```js
const CFG = {
  githubUser: 'Rafie-kun',
  weatherCity: 'London',
  n8nUrl: 'http://192.168.1.100:5678',
};
```

---

## 📄 License

MIT © [Rafie-kun](https://github.com/Rafie-kun)

---

<div align="center">

🍓 Built on Raspberry Pi 5 · Powered by n8n · Made to show off

**[⭐ Star this repo](https://github.com/Rafie-kun/pi-dashboard)** · **[🐛 Issues](https://github.com/Rafie-kun/pi-dashboard/issues)**

</div>
