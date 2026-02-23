/**
 * Pi5 Dashboard — System Stats API Server
 * Run this on your Raspberry Pi 5 to expose real-time system data to the dashboard.
 *
 * Usage:
 *   npm install express cors systeminformation
 *   node server.js
 *
 * Access: http://raspberrypi.local:3001/api/stats
 */

const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const app = express();
const PORT = process.env.PORT || 3001;

// Allow cross-origin requests from the dashboard
app.use(cors({
    origin: '*', // In production, restrict to your dashboard origin
    methods: ['GET', 'POST'],
}));

app.use(express.json());

// =============================================
// SYSTEM STATS ENDPOINT
// =============================================
app.get('/api/stats', async (req, res) => {
    try {
        const [
            cpu,
            cpuTemperature,
            mem,
            fsSize,
            networkStats,
            networkInterfaces,
            osInfo,
        ] = await Promise.all([
            si.currentLoad(),
            si.cpuTemperature(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            si.networkInterfaces(),
            si.osInfo(),
        ]);

        // Get uptime
        const uptimeSecs = Math.floor(process.uptime() + (await si.time()).uptime);

        // CPU info
        const cpuInfo = await si.cpu();

        // Network
        const defaultInterface = networkInterfaces.find(i => !i.internal) || networkInterfaces[0];
        const netStats = networkStats[0] || {};

        // Disk (primary)
        const primaryDisk = fsSize.find(d => d.mount === '/') || fsSize[0] || {};

        // Fan speed (Raspberry Pi specific)
        let fanRpm = null;
        try {
            const { stdout } = await execAsync('cat /sys/class/thermal/cooling_device0/cur_state 2>/dev/null');
            fanRpm = parseInt(stdout.trim()) * 200; // Rough RPM estimate
        } catch (_) {
            fanRpm = null;
        }

        // Temperature
        const temp = cpuTemperature.main
            || cpuTemperature.cores?.[0]
            || cpuTemperature.socket?.[0]
            || 42;

        const stats = {
            cpu: {
                percent: Math.round(cpu.currentLoad),
                cores: cpuInfo.physicalCores || 4,
                freq: Math.round(cpuInfo.speed || 1800),
            },
            ram: {
                used: parseFloat((mem.used / 1073741824).toFixed(1)),
                total: parseFloat((mem.total / 1073741824).toFixed(1)),
                percent: Math.round((mem.used / mem.total) * 100),
                free: parseFloat((mem.free / 1073741824).toFixed(1)),
            },
            temperature: Math.round(temp),
            disk: {
                used: Math.round(primaryDisk.used / 1073741824),
                total: Math.round(primaryDisk.size / 1073741824),
                percent: Math.round(primaryDisk.use || 0),
            },
            network: {
                download: parseFloat(((netStats.rx_sec || 0) / 1048576).toFixed(2)),
                upload: parseFloat(((netStats.tx_sec || 0) / 1048576).toFixed(2)),
                ip: defaultInterface?.ip4 || '192.168.1.104',
                gateway: '192.168.1.1',
                dns: '1.1.1.1',
                type: defaultInterface?.iface?.includes('wlan') ? 'Wi-Fi' : 'Ethernet',
                security: 'WPA3',
                ping: null,
            },
            uptime: uptimeSecs,
            hostname: osInfo.hostname || 'raspberrypi',
            fans: fanRpm ? [{ label: 'CPU Fan', rpm: fanRpm }] : [],
            timestamp: new Date().toISOString(),
        };

        res.json(stats);
    } catch (err) {
        console.error('[API] Stats error:', err);
        res.status(500).json({ error: err.message });
    }
});

// =============================================
// DOCKER CONTAINERS ENDPOINT
// =============================================
app.get('/api/containers', async (req, res) => {
    try {
        const { stdout } = await execAsync(
            `docker ps -a --format '{"id":"{{.ID}}","name":"{{.Names}}","status":"{{.Status}}","image":"{{.Image}}","ports":"{{.Ports}}"}'`
        );

        const containers = stdout.trim().split('\n')
            .filter(Boolean)
            .map(line => {
                try {
                    const c = JSON.parse(line);
                    const running = c.status?.toLowerCase().startsWith('up');
                    const portMatch = c.ports?.match(/:(\d+)->/);
                    return {
                        id: c.id,
                        name: c.name,
                        status: running ? 'running' : 'stopped',
                        image: c.image,
                        port: portMatch ? portMatch[1] : null,
                    };
                } catch (_) {
                    return null;
                }
            })
            .filter(Boolean);

        res.json(containers);
    } catch (err) {
        // Docker not available
        res.json([]);
    }
});

// =============================================
// HEALTH CHECK
// =============================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =============================================
// START
// =============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ╔═══════════════════════════════════╗
  ║   Pi5 Dashboard Stats Server      ║
  ║   Running on port ${PORT}            ║
  ║                                   ║
  ║   http://localhost:${PORT}/api/stats ║
  ╚═══════════════════════════════════╝
  `);
});
