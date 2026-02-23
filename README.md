<div align="center">

# 🍓 Pi5 Command Center

**Full-Stack Self-Hosted Dashboard for Raspberry Pi 5**

Real-time system monitoring · GitHub stats · Weather · Task management · n8n Automation Hub · Interactive Terminal · Complete Pi OS setup guide

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Raspberry Pi 5](https://img.shields.io/badge/Raspberry%20Pi-5-red?logo=raspberrypi&logoColor=white)](https://raspberrypi.com)
[![n8n](https://img.shields.io/badge/n8n-Automation-orange)](https://n8n.io)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[🚀 Live Demo](#) • [📖 Documentation](#features) • [💬 Support](#support)

![Dashboard Preview](https://via.placeholder.com/1200x600/1e293b/38bdf8?text=Pi5+Command+Center+Dashboard)

</div>

---

## ✨ Features

### 📊 **Dashboard Tab**
- **Real-time System Vitals**: Live CPU, RAM, disk, and temperature monitoring with animated gauges
- **Weather Widget**: Current conditions, forecast, and detailed meteorology
- **GitHub Integration**: Profile stats, contribution graph, follower/star counts
- **Recent Commits**: Latest repository activity with timestamps
- **Task Manager**: Create, complete, and organize daily tasks with priorities
- **Network Monitor**: Live bandwidth usage, IP configuration, connection details
- **Responsive Design**: Perfect on desktop, tablet, and mobile

### ⚡ **Automations Tab (n8n Integration)**
- **Workflow Manager**: View all n8n workflows with status, execution count, and last run time
- **Quick Controls**: Start/pause workflows with one click
- **Category Filtering**: Organize by Notifications, Development, Home Automation, etc.
- **Search Functionality**: Find workflows instantly
- **Add New Workflows**: Create custom automations directly from the dashboard
- **Real-time Stats**: Active workflow count, execution rate, success metrics
- **Pre-built Templates**: Discord alerts, GitHub watchers, RSS feeds, and more

### 💻 **Terminal Tab**
- **Interactive Pi Terminal**: Simulated command-line interface
- **Real Command Support**: `ls`, `pwd`, `top`, `docker ps`, `free`, `df`, and more
- **Command History**: Navigate with ↑↓ arrow keys
- **Quick Command Buttons**: One-click access to common commands
- **Authentic Styling**: Looks like a real SSH session
- **Educational**: Perfect for learning Linux commands

### 📖 **Pi OS Guide Tab**
- **Step-by-Step Installation**: Flash Pi OS with Raspberry Pi Imager
- **First Boot Setup**: Network configuration, system updates, locale settings
- **SSH Security**: Key-based authentication, fail2ban, best practices
- **Docker Installation**: Complete setup with Docker Compose
- **n8n Deployment**: Run automation platform with persistent data
- **Essential Commands**: Categorized reference for system monitoring, networking, Docker, services
- **Dashboard Deployment**: Install and run this dashboard on your Pi

### ⚙️ **Settings Tab**
- **API Configuration**: GitHub tokens, weather keys, n8n URLs
- **System Customization**: Update intervals, hostnames, endpoints
- **Toggle Options**: Auto-refresh, notifications, animations
- **Import/Export**: Backup and restore configuration
- **LocalStorage Persistence**: Settings saved across sessions

---

## 🚀 Quick Start

### **Option 1: Development Mode (Fast)**
```bash
# Clone the repository
git clone https://github.com/Rafie-kun/pi-dashboard.git
cd pi-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
# → Open http://localhost:5173
```

### **Option 2: Production Build**
```bash
# Build the app
npm run build

# Preview production build
npm run preview
# → Open http://localhost:4173
```

### **Option 3: Deploy on Raspberry Pi**
```bash
# Clone on your Pi
ssh pi@raspberrypi.local
git clone https://github.com/Rafie-kun/pi-dashboard.git
cd pi-dashboard

# Install and build
npm install
npm run build

# Run with PM2 (auto-restart)
sudo npm install -g pm2
pm2 start "npm run preview" --name pi-dashboard
pm2 startup
pm2 save

# Access from any device
# → http://YOUR_PI_IP:4173
```

---

## 🔧 Configuration

### **Environment Variables**
Create `.env` file in the project root:

```env
# GitHub (for GitHub widget)
VITE_GITHUB_USERNAME=Rafie-kun
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Weather (free key from openweathermap.org)
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_WEATHER_CITY=London

# n8n Automation
VITE_N8N_URL=http://192.168.1.104:5678
VITE_N8N_API_KEY=your_n8n_api_key

# System Stats API (optional, uses mock data by default)
VITE_API_URL=http://192.168.1.104:3001
```

> **No API keys?** The dashboard works perfectly with simulated data for portfolio demos!

### **API Keys (All Free)**

| Service | Get Key | Required? |
|---------|---------|-----------|
| GitHub | [Create Personal Access Token](https://github.com/settings/tokens) | Optional |
| OpenWeather | [Sign up](https://openweathermap.org/api) | Optional |
| n8n | Your self-hosted instance | Optional |

---

## 🐳 n8n Setup

### **Install with Docker**
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

### **Access n8n**
Open `http://YOUR_PI_IP:5678` in your browser

### **Connect to Dashboard**
1. Go to Settings tab
2. Enter your n8n URL: `http://YOUR_PI_IP:5678`
3. (Optional) Add API key for advanced features
4. Switch to Automations tab to manage workflows

---

## 📱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Icons** | Lucide React |
| **Build Tool** | Vite 7 |
| **Charts** | Recharts |
| **State** | Zustand |
| **API Calls** | Axios + React Query |
| **Deployment** | Raspberry Pi OS, PM2 |

---

## 📁 Project Structure

```
pi-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard view
│   │   ├── N8nManager.tsx          # n8n workflow manager
│   │   ├── TerminalSimulator.tsx   # Interactive terminal
│   │   ├── PiOsGuide.tsx           # Complete setup guide
│   │   ├── Settings.tsx            # Configuration panel
│   │   └── widgets/
│   │       ├── SystemGauge.tsx     # Circular progress gauges
│   │       ├── WeatherWidget.tsx   # Weather display
│   │       ├── GitHubWidget.tsx    # GitHub stats
│   │       ├── TasksWidget.tsx     # Task manager
│   │       ├── NetworkWidget.tsx   # Network monitor
│   │       └── RecentCommits.tsx   # Git activity
│   ├── App.tsx                     # Main app with navigation
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles + animations
├── .env.example                    # Environment template
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind customization
└── README.md                       # This file
```

---

## 🎨 Customization

### **Color Scheme**
Edit `tailwind.config.js` to change colors:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',    // Violet
        secondary: '#10b981',  // Emerald
        accent: '#06b6d4',     // Cyan
      }
    }
  }
}
```

### **Dashboard Widgets**
Add your own widgets in `src/components/widgets/`:
```tsx
export function MyWidget() {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
      {/* Your content */}
    </div>
  );
}
```

---

## 🚢 Deployment Options

### **1. Static Hosting (GitHub Pages, Vercel)**
```bash
npm run build
# Upload dist/ folder to your host
```

### **2. Raspberry Pi (Recommended)**
```bash
# Use PM2 for production
pm2 start "npm run preview" --name dashboard
pm2 startup && pm2 save
```

### **3. Docker**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

```bash
docker build -t pi-dashboard .
docker run -d -p 4173:4173 pi-dashboard
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **API data not loading** | Check `.env` file and API keys. Dashboard works with mock data if keys are missing |
| **n8n not connecting** | Verify n8n is running: `docker ps`. Check URL in Settings |
| **Port already in use** | Change port: `npm run preview -- --port 5000` |
| **Build errors** | Delete `node_modules` and reinstall: `rm -rf node_modules && npm install` |

---

## 📸 Screenshots

### Dashboard View
![Dashboard](https://via.placeholder.com/1200x600/1e293b/10b981?text=Dashboard+Tab)

### n8n Automation Manager
![n8n](https://via.placeholder.com/1200x600/1e293b/8b5cf6?text=n8n+Workflows)

### Interactive Terminal
![Terminal](https://via.placeholder.com/1200x600/0f172a/22c55e?text=Terminal+Simulator)

### Pi OS Setup Guide
![Guide](https://via.placeholder.com/1200x600/1e293b/06b6d4?text=Setup+Guide)

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **Raspberry Pi Foundation** - For the amazing Pi 5 hardware
- **n8n.io** - Incredible open-source automation platform
- **Tailwind CSS** - Beautiful utility-first CSS framework
- **Lucide** - Clean and consistent icon library
- **React Team** - Powerful UI framework

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/Rafie-kun/pi-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Rafie-kun/pi-dashboard/discussions)
- **Email**: rafiecool1233@gmail.com
---

<div align="center">

### ⭐ Star this repo if you find it useful!

**Built with ❤️ for the Raspberry Pi community**

🍓 **Perfect for portfolio projects · Self-hosting · Home labs · Learning**

[View Demo](#) · [Report Bug](https://github.com/Rafie-kun/pi-dashboard/issues) · [Request Feature](https://github.com/Rafie-kun/pi-dashboard/issues)

</div>
