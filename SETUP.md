# 🚀 How to Add Pi Dashboard to GitHub

Follow these steps exactly — copy-paste each command into your terminal.

---

## Step 1 — Create the repo on GitHub

1. Go to **https://github.com/new**
2. Repository name: `pi-dashboard`
3. Description: `Self-hosted Raspberry Pi 5 command dashboard with n8n automation hub`
4. Set to **Public** (so it shows on your portfolio)
5. ✅ Add a README: **NO** (we already have one)
6. Click **Create repository**

---

## Step 2 — Download these files

Download the zip from this project and extract it, or copy each file manually into a new folder called `pi-dashboard`.

Your folder should look like this:
```
pi-dashboard/
├── public/
│   └── index.html       ← The dashboard
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── SETUP.md
```

---

## Step 3 — Push to GitHub

Open your terminal, `cd` into the `pi-dashboard` folder, then run:

```bash
# Initialize git
git init

# Stage all files
git add .

# First commit
git commit -m "feat: initial Pi5 dashboard with n8n automation hub"

# Connect to your GitHub repo (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pi-dashboard.git

# Push
git branch -M main
git push -u origin main
```

Done! Your repo is live at `https://github.com/YOUR_USERNAME/pi-dashboard`

---

## Step 4 — (Optional) Enable GitHub Pages

This lets people view the dashboard live from `https://YOUR_USERNAME.github.io/pi-dashboard`

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/public`
5. Click Save
6. Wait ~60 seconds, then visit the URL shown

---

## Step 5 — Add to your Portfolio

Add this to your portfolio's projects section:

```
Pi5 Command Dashboard
A self-hosted personal dashboard running on Raspberry Pi 5.
Features: live system stats, GitHub integration, n8n automation hub,
weather, tasks, and network monitoring. Built with vanilla HTML/CSS/JS
and Node.js. Zero external dependencies.

→ GitHub: https://github.com/YOUR_USERNAME/pi-dashboard
→ Live Demo: https://YOUR_USERNAME.github.io/pi-dashboard
```

---

## Updating the Repo Later

Any time you make changes:

```bash
git add .
git commit -m "feat: describe what you changed"
git push
```

---

## Personalizing Before You Push

Open `public/index.html` and find + replace:

| Find | Replace with |
|------|-------------|
| `Your Name` | Your actual name |
| `@yourusername` | Your GitHub username |
| `raspberrypi-node-05` | Your Pi's hostname |
| `192.168.1.104` | Your Pi's local IP |

---

That's it! 🎉
