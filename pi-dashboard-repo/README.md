<div align="center">

# 🍓 Pi5 Command Dashboard

**A self-hosted personal dashboard built for Raspberry Pi 5**  
Live system stats · GitHub integration · n8n Automation Hub · Weather · Tasks

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Pi 5](https://img.shields.io/badge/Raspberry_Pi-5-red?logo=raspberrypi)](https://www.raspberrypi.com/products/raspberry-pi-5/)
[![Self Hosted](https://img.shields.io/badge/Self--Hosted-✓-green)](https://github.com)
[![n8n](https://img.shields.io/badge/n8n-Automation-orange)](https://n8n.io)
[![HTML](https://img.shields.io/badge/HTML-Single_File-blueviolet)](public/index.html)

![Dashboard Preview](docs/preview.png)

</div>

---

## ✨ Features

| Widget | Description |
|--------|-------------|
| ⏱ **Live Clock** | Real-time HH:MM:SS with detected timezone |
| 🌤 **Weather** | Current conditions + 3-day forecast (OpenWeatherMap) |
| ⚡ **System Vitals** | Animated CPU / RAM / Temp gauges, live every 2.5s |
| 🐙 **GitHub Stats** | Profile, repos, stars, contribution heatmap |
| 📝 **Recent Commits** | Latest pushes across your repos |
| ✅ **Today's Agenda** | Interactive task checklist (Notion or local) |
| 🌐 **Network Overview** | Live sparkline, IP, DNS, ping |
| 🤖 **n8n Automation Hub** | Full app/workflow manager with add, pause, delete |

---

## 📸 Screenshots

<table>
<tr>
<td><b>Dashboard View</b></td>
<td><b>n8n Automation Hub</b></td>
</tr>
<tr>
<td><img src="docs/screenshot-dashboard.png" alt="Dashboard"/></td>
<td><img src="docs/screenshot-n8n.png" alt="n8n Hub"/></td>
</tr>
</table>

---

## 🚀 Quick Start

### Option A — Instant (no install needed)

Just open `public/index.html` in your browser. Works 100% offline with demo data.

```bash
git clone https://github.com/YOUR_USERNAME/pi-dashboard.git
cd pi-dashboard
open public/index.html   # macOS
xdg-open public/index.html  # Linux
```

### Option B — Serve from Pi (recommended)

```bash
# Clone the repo on your Pi
git clone https://github.com/YOUR_USERNAME/pi-dashboard.git
cd pi-dashboard

# Option 1: Python (built-in, zero deps)
python3 -m http.server 8080 --directory public

# Option 2: Node.js serve
npx serve public -p 8080

# Option 3: Full stack with Express backend (real system stats)
npm install
node server.js
```

Then visit `http://<your-pi-ip>:8080` from any device on your network.

### Option C — Auto-start with PM2

```bash
sudo npm install -g pm2

# Serve static (simple)
pm2 serve public 8080 --name pi-dashboard

# OR full backend (real stats)
NODE_ENV=production pm2 start server.js --name pi-dashboard

pm2 startup   # auto-start on boot
pm2 save
```

---

## ⚙️ Configuration

Copy the env template and fill in your keys:

```bash
cp .env.example .env
nano .env
```

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `REACT_APP_GITHUB_USERNAME` | ✅ | Your GitHub username |
| `REACT_APP_GITHUB_TOKEN` | Recommended | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `REACT_APP_WEATHER_KEY` | Optional | [openweathermap.org/api](https://openweathermap.org/api) (free) |
| `REACT_APP_WEATHER_CITY` | Optional | City name e.g. `London` |
| `REACT_APP_NOTION_TOKEN` | Optional | [notion.so/my-integrations](https://www.notion.so/my-integrations) |
| `REACT_APP_NOTION_DB_ID` | Optional | Database ID from Notion URL |

> **Without any API keys**, the dashboard runs in demo mode with realistic simulated data — still looks great for portfolio screenshots.

---

## ⚡ n8n Automation Hub

The **Automations** tab is a full workflow manager for your self-hosted n8n instance.

### Setting up n8n on Pi 5

**Docker (recommended):**

```bash
# Create n8n data directory
mkdir -p ~/n8n-data

# Run n8n container
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v ~/n8n-data:/home/node/.n8n \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=yourpassword \
  n8nio/n8n

# Check it's running
docker ps
```

**Then open n8n:** `http://<pi-ip>:5678`

### Built-in App Templates

Click **⚡ Add App / Workflow** and choose a quick template:

| Template | What it does |
|----------|-------------|
| 💬 **Discord Bot** | Posts Pi alerts (CPU/temp) to a Discord channel |
| 🐙 **GitHub Alerts** | Notifies on new PRs, CI failures, stars |
| 🏠 **Home Assistant** | Syncs Pi metrics to HA via MQTT |
| ✈️ **Telegram Bot** | Send commands and receive alerts via Telegram |
| 📰 **RSS Digest** | Daily email of curated tech news |
| 🛡️ **Pi-hole Stats** | Pull Pi-hole block stats into dashboard |

### Managing Workflows

- **▶ Start / ⏸ Pause** — toggle workflow execution without deleting
- **🔗 Webhook** — click to open the webhook URL directly
- **⚡ Open n8n** — jump to the n8n editor for that workflow
- **🗑 Delete** — remove from dashboard (does not delete from n8n)

---

## 🏗️ Project Structure

```
pi-dashboard/
│
├── public/
│   └── index.html          ← Complete single-file dashboard (open this!)
│
├── src/                    ← React version (optional, full-stack)
│   ├── App.js
│   ├── App.css
│   └── components/
│       ├── ClockCard.js
│       ├── WeatherCard.js
│       ├── GitHubCard.js
│       ├── CommitsCard.js
│       ├── SystemStatsCard.js
│       ├── TasksCard.js
│       └── N8nPanel.js
│
├── server.js               ← Express backend (real Pi system stats)
├── .env.example            ← Environment variable template
├── package.json
├── docs/                   ← Screenshots for README
└── README.md
```

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (zero dependencies) |
| Fonts | JetBrains Mono + Outfit (Google Fonts) |
| Backend (optional) | Node.js + Express |
| System Stats | `/proc/stat`, `/sys/thermal`, `os` module |
| APIs | GitHub REST v3, OpenWeatherMap, Notion |
| Automation | n8n (self-hosted Docker) |
| Process Manager | PM2 |
| Hosting | Raspberry Pi 5 (self-hosted) |

---

## 🔌 Real System Stats (server.js)

The Express backend reads real Pi stats:

```
GET /api/system    → CPU %, RAM %, disk %, CPU temp, uptime, IP
GET /api/tasks     → Pulls today's tasks from Notion database
```

Without the backend, the dashboard shows live-animated simulated stats that look identical to real data.

---

## 🎨 Customization

All colors are CSS variables at the top of `public/index.html`:

```css
:root {
  --bg:     #04070f;   /* Background */
  --blue:   #3b9eff;   /* Primary accent */
  --green:  #22d98e;   /* Success / live */
  --orange: #ff8c42;   /* Warning */
  --red:    #ff4f6a;   /* Error / high */
  --purple: #a78bfa;   /* n8n accent */
}
```

To change the Pi hostname shown in the header, find `raspberrypi-node-05` and replace it.

---

## 📱 Responsive

| Breakpoint | Layout |
|-----------|--------|
| `≥1200px` | Full 5-column bento grid |
| `768–1200px` | 3-column adaptive |
| `<768px` | Single column stacked |

---

## 🚢 Deployment Options

### GitHub Pages (static, no backend)

```bash
# Push public/ to gh-pages branch
git subtree push --prefix public origin gh-pages
```
Then enable GitHub Pages → `gh-pages` branch in repo Settings.

### Nginx on Pi (production)

```nginx
server {
    listen 80;
    server_name pi.local;
    root /home/pi/pi-dashboard/public;
    index index.html;

    # Proxy backend API
    location /api/ {
        proxy_pass http://localhost:3001;
    }
}
```

### Docker

```bash
docker build -t pi-dashboard .
docker run -d -p 8080:8080 pi-dashboard
```

---

## 🛠️ Development

```bash
git clone https://github.com/YOUR_USERNAME/pi-dashboard.git
cd pi-dashboard
npm install
npm start      # React dev server on :3000
node server.js # Backend on :3001
```

---

## 🤝 Contributing

Pull requests are welcome! If you add a new widget or n8n template, please:

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/my-widget`
3. Commit with conventional commits: `git commit -m "feat: add Plex media widget"`
4. Push and open a PR

---

## 📄 License

MIT © [Your Name](https://github.com/YOUR_USERNAME)

---

<div align="center">

**Built on a Raspberry Pi 5 · Powered by n8n · Made with ❤️**

[⭐ Star this repo](https://github.com/YOUR_USERNAME/pi-dashboard) if you find it useful!

</div>
