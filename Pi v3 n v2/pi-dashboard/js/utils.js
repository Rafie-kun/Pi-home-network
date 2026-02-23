/**
 * Pi5 Dashboard — Utility Functions
 */

/**
 * Get merged config (localStorage overrides defaults)
 */
function getConfig() {
    const saved = JSON.parse(localStorage.getItem('pi_dashboard_config') || '{}');
    return { ...window.PI_DASHBOARD_CONFIG, ...saved };
}

/**
 * Save config key-value pairs to localStorage
 */
function saveConfig(update) {
    const current = JSON.parse(localStorage.getItem('pi_dashboard_config') || '{}');
    localStorage.setItem('pi_dashboard_config', JSON.stringify({ ...current, ...update }));
}

/**
 * Format relative time from ISO date string
 */
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format bytes to human-readable
 */
function formatBytes(bytes, decimals = 1) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to human-readable uptime
 */
function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    return parts.join(' ') || '< 1m';
}

/**
 * Show a toast notification
 */
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toast-container');
    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <span class="material-symbols-outlined">${icons[type]}</span>
    <span>${message}</span>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Add a log entry to the system log widget
 */
function addLog(message, level = 'info') {
    const body = document.getElementById('log-body');
    if (!body) return;

    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
    <span class="log-ts">${ts}</span>
    <span class="log-level ${level}">${level.toUpperCase()}</span>
    <span class="log-msg">${message}</span>
  `;

    body.insertBefore(entry, body.firstChild);

    // Keep max 50 log entries
    while (body.children.length > 50) {
        body.removeChild(body.lastChild);
    }
}

/**
 * Set a gauge SVG value (0-100 percent)
 */
function setGauge(circleId, percent) {
    const circle = document.getElementById(circleId);
    if (!circle) return;
    const circumference = 2 * Math.PI * 50; // r=50
    const offset = circumference - (percent / 100) * circumference;
    const dashArray = (percent / 100) * circumference;
    circle.style.strokeDasharray = `${dashArray} ${circumference}`;
}

/**
 * Animate a number counter
 */
function animateNumber(element, target, suffix = '', duration = 800) {
    if (!element) return;
    const start = parseFloat(element.textContent) || 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * eased;

        element.textContent = Number.isInteger(target)
            ? Math.round(current) + suffix
            : current.toFixed(1) + suffix;

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/**
 * Draw a sparkline on a canvas element
 */
function drawSparkline(canvasId, data, color = '#0d59f2', fill = true) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    const max = Math.max(...data) || 1;
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * W,
        y: H - ((val - min) / range) * (H - 4) - 2
    }));

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        const cp1x = (points[i - 1].x + points[i].x) / 2;
        ctx.bezierCurveTo(cp1x, points[i - 1].y, cp1x, points[i].y, points[i].x, points[i].y);
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill
    if (fill) {
        ctx.lineTo(points[points.length - 1].x, H);
        ctx.lineTo(points[0].x, H);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, color.replace(')', ', 0.25)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));

        // fallback if replace didn't work with hex
        ctx.fillStyle = color + '22';
        ctx.fill();
    }
}

/**
 * Simple fetch with timeout wrapper
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return res;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

/**
 * Format commit message type with color
 */
function formatCommitType(msg) {
    const types = {
        'feat:': { label: 'feat', color: 'var(--neon-green)' },
        'fix:': { label: 'fix', color: '#ef4444' },
        'docs:': { label: 'docs', color: 'var(--neon-yellow)' },
        'chore:': { label: 'chore', color: 'var(--text-muted)' },
        'style:': { label: 'style', color: 'var(--neon-purple)' },
        'refactor:': { label: 'refactor', color: 'var(--neon-cyan)' },
        'test:': { label: 'test', color: 'var(--neon-orange)' },
        'perf:': { label: 'perf', color: 'var(--primary)' },
    };

    for (const [prefix, info] of Object.entries(types)) {
        if (msg.toLowerCase().startsWith(prefix)) {
            return { type: info.label, color: info.color, rest: msg.slice(prefix.length).trim() };
        }
    }

    return { type: null, color: null, rest: msg };
}

/**
 * Get weather emoji from condition code
 */
function getWeatherEmoji(id, icon) {
    const isNight = icon && icon.endsWith('n');
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 400) return '🌦️';
    if (id >= 500 && id < 600) return id < 510 ? '🌧️' : '🌨️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800) return isNight ? '🌙' : '☀️';
    if (id === 801) return isNight ? '🌃' : '🌤️';
    if (id <= 804) return '☁️';
    return '🌡️';
}

/**
 * Day name from index
 */
function getDayName(dateStr, short = true) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    return short ? days[d.getDay()] : fullDays[d.getDay()];
}

// Expose globally
window.utils = {
    getConfig,
    saveConfig,
    timeAgo,
    formatBytes,
    formatUptime,
    showToast,
    addLog,
    setGauge,
    animateNumber,
    drawSparkline,
    fetchWithTimeout,
    formatCommitType,
    getWeatherEmoji,
    getDayName,
};
