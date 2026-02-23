/**
 * System Stats Widget — CPU, RAM, Temp, Disk, Network
 * Includes animated SVG gauges, real-time sparklines, and status badge.
 */
const SystemWidget = {
    _interval: null,
    _netDownHistory: Array(40).fill(0),
    _netUpHistory: Array(40).fill(0),
    _uptimeStart: null,

    async init() {
        await this.refresh();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), cfg.refreshIntervalMs || 30000);
        utils.addLog('System stats widget initialized', 'success');
    },

    async refresh() {
        try {
            const data = await API.getSystemStats();
            this.render(data);
        } catch (e) {
            utils.addLog(`System stats error: ${e.message}`, 'error');
        }
    },

    render(data) {
        if (!data) return;

        // === CPU ===
        const cpuPct = data.cpu?.percent ?? 0;
        utils.setGauge('cpu-circle', cpuPct);
        const cpuVal = document.getElementById('cpu-val');
        const cpuCores = document.getElementById('cpu-cores');
        const cpuFreq = document.getElementById('cpu-freq');
        if (cpuVal) cpuVal.textContent = `${cpuPct}%`;
        if (cpuCores) cpuCores.textContent = `${data.cpu?.cores ?? 4} Cores`;
        if (cpuFreq) {
            const freq = data.cpu?.freq ?? 1800;
            cpuFreq.textContent = freq > 1000 ? `${(freq / 1000).toFixed(1)} GHz` : `${freq} MHz`;
        }

        // === RAM ===
        const ramUsed = data.ram?.used ?? 0;
        const ramTotal = data.ram?.total ?? 8;
        const ramPct = data.ram?.percent ?? Math.round((ramUsed / ramTotal) * 100);
        utils.setGauge('ram-circle', ramPct);
        const ramVal = document.getElementById('ram-val');
        const ramTotalEl = document.getElementById('ram-total');
        const ramPctEl = document.getElementById('ram-pct');
        if (ramVal) ramVal.textContent = `${ramUsed}GB`;
        if (ramTotalEl) ramTotalEl.textContent = `${ramTotal}GB DDR4X`;
        if (ramPctEl) ramPctEl.textContent = `${ramPct}%`;

        // === Temperature ===
        const temp = data.temperature ?? 42;
        const tempPct = Math.min(100, Math.round((temp / 90) * 100));
        utils.setGauge('temp-circle', tempPct);

        const tempVal = document.getElementById('temp-val');
        const tempStatus = document.getElementById('temp-status');
        const fanSpeed = document.getElementById('fan-speed');

        if (tempVal) tempVal.textContent = `${temp}°C`;
        if (tempStatus) {
            if (temp < 50) { tempStatus.textContent = '✅ Optimal'; tempStatus.style.color = 'var(--neon-green)'; }
            else if (temp < 65) { tempStatus.textContent = '⚠️ Warm'; tempStatus.style.color = 'var(--neon-yellow)'; }
            else { tempStatus.textContent = '🔴 Hot'; tempStatus.style.color = '#ef4444'; }
        }
        if (fanSpeed) {
            const rpm = data.fans?.[0]?.rpm ?? Math.round(1000 + (temp - 40) * 20);
            fanSpeed.textContent = `Fan: ${rpm}rpm`;
        }

        // Update temp gauge color
        const tempCircle = document.getElementById('temp-circle');
        if (tempCircle) {
            if (temp < 50) tempCircle.style.stroke = 'var(--neon-green)';
            else if (temp < 65) tempCircle.style.stroke = 'var(--neon-yellow)';
            else tempCircle.style.stroke = '#ef4444';
        }

        // === Disk ===
        const diskUsed = data.disk?.used ?? 45;
        const diskTotal = data.disk?.total ?? 128;
        const diskPct = data.disk?.percent ?? Math.round((diskUsed / diskTotal) * 100);
        utils.setGauge('disk-circle', diskPct);

        const diskVal = document.getElementById('disk-val');
        const diskTotalEl = document.getElementById('disk-total');
        const diskPctEl = document.getElementById('disk-pct');
        if (diskVal) diskVal.textContent = `${diskUsed}GB`;
        if (diskTotalEl) diskTotalEl.textContent = `${diskTotal}GB Total`;
        if (diskPctEl) diskPctEl.textContent = `${diskPct}%`;

        // === Network ===
        const netDown = data.network?.download ?? 0;
        const netUp = data.network?.upload ?? 0;

        this._netDownHistory.push(netDown);
        this._netDownHistory.shift();
        this._netUpHistory.push(netUp);
        this._netUpHistory.shift();

        const netDownEl = document.getElementById('net-down');
        const netUpEl = document.getElementById('net-up');
        if (netDownEl) netDownEl.textContent = `${netDown.toFixed(1)} MB/s`;
        if (netUpEl) netUpEl.textContent = `${netUp.toFixed(1)} MB/s`;

        // Top stats bar
        const pillTemp = document.getElementById('pill-temp');
        const pillCpu = document.getElementById('pill-cpu');
        const pillRam = document.getElementById('pill-ram');
        const pillNetDown = document.getElementById('pill-net-down');
        const pillNetUp = document.getElementById('pill-net-up');
        if (pillTemp) pillTemp.textContent = `${temp}°C`;
        if (pillCpu) pillCpu.textContent = `CPU: ${cpuPct}%`;
        if (pillRam) pillRam.textContent = `RAM: ${ramUsed}GB`;
        if (pillNetDown) pillNetDown.textContent = `↓ ${netDown.toFixed(1)} MB/s`;
        if (pillNetUp) pillNetUp.textContent = `↑ ${netUp.toFixed(1)} MB/s`;

        // System status badge
        this.updateStatusBadge(cpuPct, temp, diskPct);

        // Uptime
        if (data.uptime) {
            const uptimeEl = document.getElementById('uptime-display');
            if (uptimeEl) {
                uptimeEl.textContent = `System Online • ${utils.formatUptime(data.uptime)} uptime`;
            }
        }

        // Hostname
        const hostname = document.getElementById('pi-hostname');
        if (hostname && data.hostname) hostname.textContent = data.hostname;

        // Network info
        const ipEl = document.getElementById('local-ip');
        const gwEl = document.getElementById('net-gateway');
        const dnsEl = document.getElementById('net-dns');
        const typeEl = document.getElementById('net-type');
        const secEl = document.getElementById('net-security');
        const pingEl = document.getElementById('ping-val');
        if (ipEl) ipEl.textContent = data.network?.ip ?? '192.168.1.104';
        if (gwEl) gwEl.textContent = data.network?.gateway ?? '192.168.1.1';
        if (dnsEl) dnsEl.textContent = data.network?.dns ?? '1.1.1.1';
        if (typeEl) typeEl.textContent = data.network?.type ?? 'Ethernet';
        if (secEl) secEl.textContent = data.network?.security ?? 'WPA3';
        if (pingEl) pingEl.textContent = `${data.network?.ping ?? '--'} ms`;

        // Draw net chart
        this.drawNetChart();
    },

    updateStatusBadge(cpu, temp, disk) {
        const badge = document.getElementById('system-status-badge');
        const text = document.getElementById('system-status-text');
        if (!badge || !text) return;

        badge.className = 'status-badge';

        if (cpu > 80 || temp > 75 || disk > 90) {
            badge.classList.add('critical');
            text.textContent = '🔴 High Load';
        } else if (cpu > 60 || temp > 60 || disk > 75) {
            badge.classList.add('warning');
            text.textContent = '⚠️ Elevated';
        } else {
            text.textContent = '✅ Normal Load';
        }
    },

    drawNetChart() {
        const canvas = document.getElementById('net-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        const allData = [...this._netDownHistory, ...this._netUpHistory];
        const maxVal = Math.max(...allData, 1);

        // Draw download (blue)
        this.drawLine(ctx, this._netDownHistory, maxVal, W, H, '#0d59f2', 'rgba(13,89,242,0.15)');

        // Draw upload (green)
        this.drawLine(ctx, this._netUpHistory, maxVal, W, H, '#39FF14', 'rgba(57,255,20,0.08)');
    },

    drawLine(ctx, data, max, W, H, color, fillColor) {
        if (data.length < 2) return;

        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * W,
            y: H - (val / max) * (H - 4) - 2
        }));

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            const cpx = (points[i - 1].x + points[i].x) / 2;
            ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill
        ctx.lineTo(points[points.length - 1].x, H);
        ctx.lineTo(points[0].x, H);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.SystemWidget = SystemWidget;
