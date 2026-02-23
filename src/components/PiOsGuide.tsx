import { useState } from 'react';
import { BookOpen, Download, Terminal, Wifi, Lock, Package, Zap, Server, ChevronRight } from 'lucide-react';

type Section = 'install' | 'setup' | 'ssh' | 'docker' | 'n8n' | 'commands' | 'deploy';

export function PiOsGuide() {
  const [activeSection, setActiveSection] = useState<Section>('install');

  const sections = [
    { id: 'install' as Section, title: '1. Install Pi OS', icon: Download },
    { id: 'setup' as Section, title: '2. First Boot Setup', icon: Server },
    { id: 'ssh' as Section, title: '3. SSH Access', icon: Lock },
    { id: 'docker' as Section, title: '4. Docker Setup', icon: Package },
    { id: 'n8n' as Section, title: '5. Install n8n', icon: Zap },
    { id: 'commands' as Section, title: '6. Essential Commands', icon: Terminal },
    { id: 'deploy' as Section, title: '7. Deploy Dashboard', icon: Wifi },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sticky top-24">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
            <BookOpen className="w-5 h-5 text-violet-400" />
            <h3 className="font-semibold text-white">Pi OS Guide</h3>
          </div>
          <nav className="space-y-1">
            {sections.map(section => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all
                    ${isActive 
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium flex-1">{section.title}</span>
                  {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          {activeSection === 'install' && <InstallSection />}
          {activeSection === 'setup' && <SetupSection />}
          {activeSection === 'ssh' && <SshSection />}
          {activeSection === 'docker' && <DockerSection />}
          {activeSection === 'n8n' && <N8nSection />}
          {activeSection === 'commands' && <CommandsSection />}
          {activeSection === 'deploy' && <DeploySection />}
        </div>
      </div>
    </div>
  );
}

function InstallSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Download className="w-6 h-6 text-violet-400" />
        Installing Raspberry Pi OS
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Download Raspberry Pi Imager">
          <p className="text-slate-300 mb-3">
            Get the official imaging tool from the Raspberry Pi Foundation:
          </p>
          <CodeBlock>
            https://www.raspberrypi.com/software/
          </CodeBlock>
          <p className="text-slate-400 text-sm mt-2">
            Available for Windows, macOS, and Linux
          </p>
        </Step>

        <Step number={2} title="Choose Your OS">
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-white">Raspberry Pi OS (64-bit)</strong> - Recommended for Pi 5
              </div>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-white">Lite version</strong> - No desktop, perfect for servers
              </div>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
              <div>
                <strong className="text-white">Full version</strong> - Includes desktop environment
              </div>
            </li>
          </ul>
        </Step>

        <Step number={3} title="Configure Advanced Settings">
          <p className="text-slate-300 mb-3">
            Click the gear icon ⚙️ in Raspberry Pi Imager:
          </p>
          <ul className="space-y-2 text-slate-300 list-disc list-inside">
            <li>Set hostname (e.g., <code className="text-violet-400">raspberrypi</code>)</li>
            <li>Enable SSH with password authentication</li>
            <li>Set username and password</li>
            <li>Configure WiFi (SSID & password)</li>
            <li>Set locale settings (timezone, keyboard)</li>
          </ul>
        </Step>

        <Step number={4} title="Flash the SD Card">
          <ol className="space-y-2 text-slate-300 list-decimal list-inside">
            <li>Insert microSD card (minimum 16GB recommended)</li>
            <li>Select your Raspberry Pi 5 as device</li>
            <li>Choose the OS you downloaded</li>
            <li>Select your SD card</li>
            <li>Click "Write" and wait 5-10 minutes</li>
          </ol>
        </Step>

        <Alert>
          ⚠️ <strong>Warning:</strong> Writing will erase all data on the SD card!
        </Alert>
      </div>
    </div>
  );
}

function SetupSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Server className="w-6 h-6 text-violet-400" />
        First Boot & Setup
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Power On Your Pi">
          <ul className="space-y-2 text-slate-300">
            <li>Insert the flashed SD card into your Pi 5</li>
            <li>Connect power supply (official 27W USB-C recommended)</li>
            <li>Wait 30-60 seconds for first boot</li>
            <li>Green LED will flash during boot</li>
          </ul>
        </Step>

        <Step number={2} title="Find Your Pi's IP Address">
          <p className="text-slate-300 mb-3">Option 1: Check your router's DHCP table</p>
          <p className="text-slate-300 mb-3">Option 2: Use a network scanner:</p>
          <CodeBlock>
            sudo nmap -sn 192.168.1.0/24
          </CodeBlock>
          <p className="text-slate-300 mb-3">Option 3: Use hostname:</p>
          <CodeBlock>
            ping raspberrypi.local
          </CodeBlock>
        </Step>

        <Step number={3} title="Update System">
          <p className="text-slate-300 mb-3">First thing after login:</p>
          <CodeBlock>
            {`sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo reboot`}
          </CodeBlock>
        </Step>

        <Step number={4} title="Configure System Settings">
          <p className="text-slate-300 mb-3">Use the configuration tool:</p>
          <CodeBlock>
            sudo raspi-config
          </CodeBlock>
          <p className="text-slate-400 text-sm mt-2">
            Enable: Camera, I2C, SPI (if needed), expand filesystem
          </p>
        </Step>
      </div>
    </div>
  );
}

function SshSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Lock className="w-6 h-6 text-violet-400" />
        SSH Access & Security
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Connect via SSH">
          <CodeBlock>
            {`ssh pi@raspberrypi.local
# or
ssh pi@192.168.1.104`}
          </CodeBlock>
        </Step>

        <Step number={2} title="Setup SSH Keys (Recommended)">
          <p className="text-slate-300 mb-3">On your computer:</p>
          <CodeBlock>
            {`ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id pi@raspberrypi.local`}
          </CodeBlock>
          <p className="text-slate-300 mb-3 mt-4">Test key-based login:</p>
          <CodeBlock>
            ssh pi@raspberrypi.local
          </CodeBlock>
        </Step>

        <Step number={3} title="Disable Password Authentication">
          <p className="text-slate-300 mb-3">After SSH keys work:</p>
          <CodeBlock>
            {`sudo nano /etc/ssh/sshd_config

# Change these lines:
PasswordAuthentication no
PubkeyAuthentication yes

sudo systemctl restart ssh`}
          </CodeBlock>
        </Step>

        <Step number={4} title="Install Fail2Ban">
          <p className="text-slate-300 mb-3">Protect against brute force:</p>
          <CodeBlock>
            {`sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban`}
          </CodeBlock>
        </Step>
      </div>
    </div>
  );
}

function DockerSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-violet-400" />
        Docker Installation
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Install Docker">
          <CodeBlock>
            {`curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker`}
          </CodeBlock>
        </Step>

        <Step number={2} title="Install Docker Compose">
          <CodeBlock>
            {`sudo apt install docker-compose -y`}
          </CodeBlock>
        </Step>

        <Step number={3} title="Test Installation">
          <CodeBlock>
            {`docker --version
docker compose version
docker run hello-world`}
          </CodeBlock>
        </Step>

        <Step number={4} title="Optimize Docker for Pi">
          <CodeBlock>
            {`sudo nano /etc/docker/daemon.json

{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

sudo systemctl restart docker`}
          </CodeBlock>
        </Step>
      </div>
    </div>
  );
}

function N8nSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Zap className="w-6 h-6 text-violet-400" />
        n8n Automation Platform
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Install n8n with Docker">
          <CodeBlock>
            {`mkdir -p ~/n8n-data

docker run -d \\
  --name n8n \\
  --restart unless-stopped \\
  -p 5678:5678 \\
  -v ~/n8n-data:/home/node/.n8n \\
  -e N8N_BASIC_AUTH_ACTIVE=true \\
  -e N8N_BASIC_AUTH_USER=admin \\
  -e N8N_BASIC_AUTH_PASSWORD=yourpassword \\
  -e WEBHOOK_URL=http://YOUR_PI_IP:5678 \\
  docker.n8n.io/n8nio/n8n`}
          </CodeBlock>
        </Step>

        <Step number={2} title="Access n8n">
          <p className="text-slate-300">
            Open in browser: <code className="text-violet-400">http://YOUR_PI_IP:5678</code>
          </p>
        </Step>

        <Step number={3} title="Create Your First Workflow">
          <ul className="space-y-2 text-slate-300">
            <li>1. Click "Add workflow"</li>
            <li>2. Add a trigger node (e.g., Cron, Webhook)</li>
            <li>3. Add action nodes (e.g., HTTP Request, Discord, Email)</li>
            <li>4. Connect nodes and configure</li>
            <li>5. Click "Activate" to start</li>
          </ul>
        </Step>

        <Step number={4} title="Example Workflows">
          <div className="space-y-3">
            <WorkflowExample
              icon="💬"
              title="System Alerts to Discord"
              description="Monitor CPU/temp and send Discord alerts when thresholds exceeded"
            />
            <WorkflowExample
              icon="🐙"
              title="GitHub Notifications"
              description="Get Telegram messages for new PRs, issues, or stars"
            />
            <WorkflowExample
              icon="📰"
              title="Daily News Digest"
              description="Fetch RSS feeds and email summary every morning"
            />
          </div>
        </Step>
      </div>
    </div>
  );
}

function CommandsSection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Terminal className="w-6 h-6 text-violet-400" />
        Essential Pi Commands
      </h2>

      <div className="space-y-4">
        <CommandReference
          category="System Monitoring"
          commands={[
            { cmd: 'htop', desc: 'Interactive process viewer' },
            { cmd: 'vcgencmd measure_temp', desc: 'Check CPU temperature' },
            { cmd: 'free -h', desc: 'Memory usage' },
            { cmd: 'df -h', desc: 'Disk usage' },
            { cmd: 'uptime', desc: 'System uptime & load' },
          ]}
        />

        <CommandReference
          category="Network"
          commands={[
            { cmd: 'ip addr', desc: 'Show network interfaces' },
            { cmd: 'ping google.com', desc: 'Test internet connectivity' },
            { cmd: 'nmap -sn 192.168.1.0/24', desc: 'Scan local network' },
            { cmd: 'netstat -tlnp', desc: 'Show listening ports' },
          ]}
        />

        <CommandReference
          category="Docker"
          commands={[
            { cmd: 'docker ps', desc: 'List running containers' },
            { cmd: 'docker logs [container]', desc: 'View container logs' },
            { cmd: 'docker stats', desc: 'Resource usage per container' },
            { cmd: 'docker compose up -d', desc: 'Start services from docker-compose.yml' },
          ]}
        />

        <CommandReference
          category="Service Management"
          commands={[
            { cmd: 'sudo systemctl status [service]', desc: 'Check service status' },
            { cmd: 'sudo systemctl restart [service]', desc: 'Restart a service' },
            { cmd: 'sudo systemctl enable [service]', desc: 'Enable service at boot' },
            { cmd: 'journalctl -u [service] -f', desc: 'Follow service logs' },
          ]}
        />
      </div>
    </div>
  );
}

function DeploySection() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Wifi className="w-6 h-6 text-violet-400" />
        Deploy This Dashboard
      </h2>

      <div className="space-y-6">
        <Step number={1} title="Clone Repository">
          <CodeBlock>
            {`cd ~
git clone https://github.com/Rafie-kun/pi-dashboard.git
cd pi-dashboard`}
          </CodeBlock>
        </Step>

        <Step number={2} title="Install Dependencies">
          <CodeBlock>
            {`npm install`}
          </CodeBlock>
        </Step>

        <Step number={3} title="Configure Environment">
          <CodeBlock>
            {`cp .env.example .env
nano .env

# Fill in:
REACT_APP_GITHUB_USERNAME=your-username
REACT_APP_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
REACT_APP_WEATHER_KEY=your_openweather_key
REACT_APP_WEATHER_CITY=London
N8N_URL=http://192.168.1.104:5678
N8N_API_KEY=your_n8n_api_key
PORT=3001`}
          </CodeBlock>
        </Step>

        <Step number={4} title="Build & Run">
          <CodeBlock>
            {`# Development mode
npm run dev

# Production build
npm run build
npm start

# Or use PM2 for auto-restart
sudo npm install -g pm2
NODE_ENV=production pm2 start server.js --name pi-dashboard
pm2 startup
pm2 save`}
          </CodeBlock>
        </Step>

        <Step number={5} title="Access Dashboard">
          <p className="text-slate-300">
            Open: <code className="text-violet-400">http://YOUR_PI_IP:3001</code>
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Access from any device on your network!
          </p>
        </Step>

        <Alert>
          🎉 <strong>Success!</strong> Your dashboard is now live. Check the Automations tab to connect n8n!
        </Alert>
      </div>
    </div>
  );
}

// Helper Components
function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-12">
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-violet-500/20 border-2 border-violet-500/50 flex items-center justify-center font-bold text-violet-300">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto">
      <code className="text-sm text-emerald-400 font-mono">{children}</code>
    </pre>
  );
}

function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-200 text-sm">
      {children}
    </div>
  );
}

function WorkflowExample({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
      <div className="text-3xl">{icon}</div>
      <div>
        <h4 className="font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function CommandReference({ category, commands }: { category: string; commands: Array<{ cmd: string; desc: string }> }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">{category}</h3>
      <div className="space-y-2">
        {commands.map((command, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3">
            <code className="text-emerald-400 font-mono text-sm">{command.cmd}</code>
            <p className="text-slate-400 text-sm mt-1">{command.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
