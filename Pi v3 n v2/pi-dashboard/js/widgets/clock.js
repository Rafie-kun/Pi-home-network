/**
 * Clock Widget — Live time with seconds
 */
const ClockWidget = {
    _interval: null,

    init() {
        this.update();
        this._interval = setInterval(() => this.update(), 1000);
        utils.addLog('Clock widget initialized', 'success');
    },

    update() {
        const now = new Date();

        // Hours & minutes
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');

        const hEl = document.getElementById('clock-h');
        const mEl = document.getElementById('clock-m');
        const sEl = document.getElementById('clock-s');
        const dateEl = document.getElementById('clock-date');
        const tzEl = document.getElementById('clock-tz');
        const navClock = document.getElementById('nav-clock');

        if (hEl) hEl.textContent = h;
        if (mEl) mEl.textContent = m;
        if (sEl) sEl.textContent = `:${s}`;

        // Also update nav clock
        if (navClock) navClock.textContent = `${h}:${m}`;

        // Date string
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
        });
        if (dateEl) dateEl.textContent = dateStr;

        // Timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
        if (tzEl) tzEl.textContent = tz.split('/').pop().replace('_', ' ');
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.ClockWidget = ClockWidget;
