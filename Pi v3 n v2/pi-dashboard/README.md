# 🥧 Pi5 Personal Dashboard

> **A full-featured, self-hosted personal dashboard for Raspberry Pi 5** — showcasing real-time system vitals, GitHub stats, weather, task management, n8n automation, Docker services, and more. Built entirely with vanilla HTML, CSS, and JavaScript. Zero frameworks, zero build tools — just open and run.

![Dashboard Preview](docs/preview.png)

---

## ✨ Features

| Widget | Description |
|--------|-------------|
| 🕐 **Live Clock** | Real-time clock with timezone display |
| 🌦️ **Weather** | Current conditions + 5-day forecast (OpenWeatherMap) |
| 🖥️ **System Vitals** | CPU, RAM, Temp, Disk — animated SVG gauges |
| 📊 **Network Monitor** | Live bandwidth chart, ping tracker, service status |
| 🐙 **GitHub Stats** | Profile, contribution heatmap, total stars |
| 📜 **Recent Commits** | Latest push events from all your repos |
| ✅ **Task Manager** | Add/complete tasks with priorities, persists locally |
| 🔄 **n8n Workflows** | View & trigger n8n automations from the dashboard |
| 🐳 **Docker Status** | Container running/stopped status at a glance |
| 📋 **System Log** | Live activity log of all widget events |

---

## 🚀 Quick Start (Zero Install)

The dashboard runs entirely in your browser — no Node.js, no build, no bundler required.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/pi5-dashboard.git
cd pi5-dashboard
```

### 2. Configure your settings

Edit `js/config.js` with your API keys, **OR** use the in-app Settings panel (⚙️ icon).

```js
// js/config.js
window.PI_DASHBOARD_CONFIG = {
  weatherApiKey: 'your_openweather_api_key',
  city: 'London',
  githubUsername: 'your-username',
  githubToken: 'ghp_your_token',   // optional
  n8nUrl: 'http://localhost:5678', // if running n8n
  n8nApiKey: 'your_n8n_api_key',
  piApiUrl: 'http://raspberrypi.local:3001/api/stats',
};
```

### 3. Open the dashboard

```bash
# macOS / Linux
open index.html

# Windows
start index.html

# Or just drag index.html into Chrome/Firefox
```

That's it. No `npm install`. No build step. Just open and enjoy.

---

## 🥧 Raspberry Pi 5 Integration

For **real live system stats** (CPU, RAM, temperature, disk, network), run the included stats server on your Pi.

### Install & Run the Stats Server

```bash
# On your Raspberry Pi 5
cd pi5-dashboard/server
npm install
npm start
```

The server starts at `http://raspberrypi.local:3001/api/stats`

Then update the dashboard config:

```js
piApiUrl: 'http://raspberrypi.local:3001/api/stats'
```

### Run as a systemd Service (Auto-start on Boot)

```bash
sudo nano /etc/systemd/system/pi5-dashboard.service
```

Paste:

```ini
[Unit]
Description=Pi5 Dashboard Stats API
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/pi5-dashboard/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable pi5-dashboard
sudo systemctl start pi5-dashboard
sudo systemctl status pi5-dashboard
```

### Serve the Dashboard on Your Pi (Optional)

```bash
# Install a simple HTTP server
npm install -g http-server

# Serve the dashboard
cd pi5-dashboard
http-server -p 8080

# Access at http://raspberrypi.local:8080
```

---

## 🔄 n8n Integration

[n8n](https://n8n.io) is a free, open-source workflow automation tool you can self-host on your Pi.

### Install n8n on Raspberry Pi 5

#### Option 1: Via npm

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install n8n
npm install -g n8n

# Start n8n
n8n start
```

#### Option 2: Via Docker (Recommended)

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -e GENERIC_TIMEZONE=Europe/London \
  -e TZ=Europe/London \
  n8nio/n8n
```

#### Option 3: Via docker-compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    volumes:
      - ~/.n8n:/home/node/.n8n
    environment:
      - GENERIC_TIMEZONE=Europe/London
      - TZ=Europe/London
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=yourpassword
```

```bash
docker-compose up -d
```

### Connect to Dashboard

1. Open n8n → Go to **Settings** → **API**
2. Create and copy your API key
3. In the dashboard click **⚙️ Settings**
4. Enter `http://YOUR_PI_IP:5678` as n8n URL
5. Paste your API key
6. Click **Save Settings**

### Useful n8n Workflows for Pi

| Workflow | Description |
|----------|-------------|
| **Pi Health Monitor** | Alert via Telegram if CPU temp > 75°C |
| **Daily GitHub Backup** | Clone all repos to local NAS at 2AM |
| **Home Assistant Sync** | Trigger automations from the dashboard |
| **Weekly Report** | Generate PDF of system stats via email |
| **Docker Auto-Update** | Pull latest images on Sunday nights |
| **Notion Task Sync** | Pull today's Notion tasks into dashboard |

---

## 🌐 API Keys & Setup

### OpenWeatherMap (Weather)

1. Register at [openweathermap.org](https://openweathermap.org/api)
2. Create a free API key (1,000 calls/day free)
3. Add to `js/config.js`:
   ```js
   weatherApiKey: 'your_key_here',
   city: 'London',  // or 'New York,US'
   ```

### GitHub

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Create a **Classic** token with `read:user` and `repo` (read) scopes
3. Add to config:
   ```js
   githubUsername: 'your-username',
   githubToken: 'ghp_your_token',
   ```

> **Note:** Without a token, the GitHub API is limited to 60 requests/hour. With a token: 5,000/hour.

---

## 🔧 Raspberry Pi OS Setup Guide

### Install Raspberry Pi OS

1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Choose **Raspberry Pi OS (64-bit)**
3. Click the **⚙️ Advanced** button:
   - Enable SSH
   - Set username/password
   - Configure Wi-Fi
4. Flash to SD card and boot

### First Boot Configuration

```bash
# SSH into your Pi
ssh pi@raspberrypi.local

# Update everything first
sudo apt update && sudo apt upgrade -y

# Install useful tools
sudo apt install -y git curl wget htop neofetch tmux

# Enable interfaces (camera, I2C, SPI, etc.)
sudo raspi-config

# Optional: mount external drive
sudo mkdir /mnt/storage
sudo mount /dev/sda1 /mnt/storage
```

### Install Docker on Pi 5

```bash
# Install Docker
curl -fsSL https://get.docker.com | sudo sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify
docker --version
docker compose version
```

### Useful Pi Commands

```bash
# Check CPU temperature
vcgencmd measure_temp

# Check CPU frequency
vcgencmd measure_clock arm

# System overview
htop

# Network info
ip addr show
ping -c 4 google.com

# Check disk space
df -h

# Memory usage
free -h

# Check running Docker containers
docker ps

# View system logs
journalctl -f

# Check systemd services
systemctl list-units --type=service --state=running
```

---

## 📁 Project Structure

```
pi5-dashboard/
├── index.html          # Main entry point
├── css/
│   ├── main.css        # Core styles, layout, design system
│   ├── widgets.css     # Widget-specific styles
│   └── animations.css  # Keyframe animations
├── js/
│   ├── config.js       # Configuration defaults
│   ├── utils.js        # Shared utility functions
│   ├── api.js          # API calls + mock data fallbacks
│   ├── app.js          # Main app controller
│   └── widgets/
│       ├── clock.js    # Clock widget
│       ├── weather.js  # Weather + forecast
│       ├── system.js   # CPU/RAM/Temp/Disk gauges
│       ├── github.js   # GitHub stats + commits
│       ├── tasks.js    # Task manager
│       ├── network.js  # Network monitor
│       ├── n8n.js      # n8n workflow manager
│       ├── docker.js   # Docker containers
│       └── log.js      # System log
└── server/
    ├── server.js       # Pi stats API (Node.js/Express)
    └── package.json    # Server dependencies
```

---

## 🎨 Customisation

### Changing Colors

Edit the CSS variables in `css/main.css`:

```css
:root {
  --primary: #0d59f2;          /* Main accent (blue) */
  --neon-green: #39FF14;       /* Active/online indicators */
  --neon-purple: #a855f7;      /* Secondary accent */
  --bg-dark: #080a0f;          /* Page background */
}
```

### Adding a Widget

1. Create `js/widgets/mywidget.js`
2. Define your widget object:
   ```js
   const MyWidget = {
     init() { /* setup */ },
     refresh() { /* fetch + update DOM */ },
     destroy() { /* cleanup */ }
   };
   window.MyWidget = MyWidget;
   ```
3. Add script tag in `index.html`
4. Add widget HTML in the bento grid
5. Call `MyWidget.init()` in `js/app.js`

### Adding Network Services to Monitor

Edit `js/config.js`:

```js
services: [
  { name: 'Home Assistant', port: 8123, color: '#f97316' },
  { name: 'Jellyfin',       port: 8096, color: '#8b5cf6' },
  { name: 'Nextcloud',      port: 443,  color: '#0082c9' },
  // Add your own...
]
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/amazing-widget`
3. Commit your changes: `git commit -m 'feat: add amazing widget'`
4. Push to the branch: `git push origin feat/amazing-widget`
5. Open a Pull Request

---

## 📝 License

MIT — Feel free to use this in your own projects and portfolio.

---

## 💡 Credits

Built with ❤️ for the Raspberry Pi community. Designed to showcase full-stack skills in a real, deployable project.

**Tech Used:**
- Pure HTML5, CSS3, JavaScript (ES2022)
- SVG for animated gauges
- Canvas API for sparkline charts
- CSS Grid for bento layout
- CSS custom properties for theming
- Glassmorphism design system
- OpenWeatherMap API
- GitHub REST API v3
- n8n REST API v1
- systeminformation (Node library for Pi stats)

---

*⭐ If you found this useful, please star the repository!*
