/**
 * Network Widget — Service status monitor, ping chart, and connection info
 */
const NetworkWidget = {
    _interval: null,
    _pingHistory: Array(30).fill(0),

    async init() {
        await this.refresh();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), cfg.refreshIntervalMs || 30000);
        utils.addLog('Network widget initialized', 'success');
    },

    async refresh() {
        const cfg = utils.getConfig();

        // Render configured services
        this.renderServices(cfg.services || []);

        // Update ping chart with mock data (in production, ping your real server)
        const newPing = Math.round(Math.random() * 6 + 1);
        this._pingHistory.push(newPing);
        this._pingHistory.shift();
        this.drawPingChart();
    },

    renderServices(services) {
        const container = document.getElementById('network-services');
        if (!container) return;

        // Show first 6 services
        const displayed = services.slice(0, 8);

        container.innerHTML = displayed.map(svc => {
            // In demo mode, simulate services being online
            const online = Math.random() > 0.15; // 85% chance online
            const color = online ? 'var(--neon-green)' : '#ef4444';

            return `
        <div class="service-item">
          <div class="service-dot" style="background: ${color}; box-shadow: 0 0 6px ${color}40;"></div>
          <span class="service-name">${svc.name}</span>
          <span class="service-port">:${svc.port}</span>
        </div>
      `;
        }).join('');
    },

    drawPingChart() {
        const canvas = document.getElementById('ping-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        const data = this._pingHistory;
        const max = Math.max(...data, 10);

        const points = data.map((val, i) => ({
            x: (i / (data.length - 1)) * W,
            y: H - (val / max) * (H - 4) - 2
        }));

        // Grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.5;
        [0.25, 0.5, 0.75].forEach(ratio => {
            ctx.beginPath();
            ctx.moveTo(0, H * ratio);
            ctx.lineTo(W, H * ratio);
            ctx.stroke();
        });

        // Line
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const cpx = (points[i - 1].x + points[i].x) / 2;
            ctx.bezierCurveTo(cpx, points[i - 1].y, cpx, points[i].y, points[i].x, points[i].y);
        }
        ctx.strokeStyle = 'var(--neon-cyan)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fill
        ctx.lineTo(points[points.length - 1].x, H);
        ctx.lineTo(points[0].x, H);
        ctx.closePath();
        ctx.fillStyle = 'rgba(6,182,212,0.08)';
        ctx.fill();

        // Current ping dot
        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--neon-cyan)';
        ctx.fill();
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.NetworkWidget = NetworkWidget;
