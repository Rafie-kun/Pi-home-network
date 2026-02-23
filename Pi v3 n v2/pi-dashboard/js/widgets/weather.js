/**
 * Weather Widget — Current conditions + 5-day forecast
 */
const WeatherWidget = {
    _interval: null,

    async init() {
        await this.refresh();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), cfg.weatherRefreshMs || 300000);
    },

    async refresh() {
        try {
            const [current, forecast] = await Promise.all([
                API.getWeather(),
                API.getWeatherForecast(),
            ]);
            this.render(current);
            this.renderForecast(forecast);
            utils.addLog(`Weather updated: ${current.name}`, 'success');
        } catch (e) {
            utils.addLog(`Weather update failed: ${e.message}`, 'error');
        }
    },

    render(data) {
        if (!data) return;

        const temp = Math.round(data.main?.temp ?? 18);
        const feels = Math.round(data.main?.feels_like ?? 16);
        const humidity = data.main?.humidity ?? 60;
        const windKmh = Math.round((data.wind?.speed ?? 0) * 3.6);
        const desc = data.weather?.[0]?.description ?? 'N/A';
        const id = data.weather?.[0]?.id ?? 800;
        const icon = data.weather?.[0]?.icon ?? '01d';
        const city = data.name ?? 'Unknown';

        const cfg = utils.getConfig();
        const unit = cfg.weatherUnits === 'imperial' ? '°F' : '°C';

        const setEl = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        setEl('weather-temp', `${temp}${unit}`);
        setEl('weather-desc', desc);
        setEl('weather-city', city);
        setEl('weather-humidity', `${humidity}%`);
        setEl('weather-wind', `${windKmh} km/h`);
        setEl('weather-feels', `Feels ${feels}${unit}`);

        const iconEl = document.getElementById('weather-icon');
        if (iconEl) iconEl.textContent = utils.getWeatherEmoji(id, icon);

        if (data._isMock) {
            utils.addLog('Weather: using demo data. Add API key in Settings.', 'info');
        }
    },

    renderForecast(data) {
        const container = document.getElementById('weather-forecast');
        if (!container || !data?.list) return;

        const cfg = utils.getConfig();
        const unit = cfg.weatherUnits === 'imperial' ? '°F' : '°C';

        // Get one reading per day (deduplicate by date)
        const seen = new Set();
        const days = data.list.filter(item => {
            const date = item.dt_txt?.split(' ')[0] || new Date().toDateString();
            if (seen.has(date)) return false;
            seen.add(date);
            return true;
        }).slice(0, 4);

        container.innerHTML = days.map(day => {
            const date = day.dt_txt?.split(' ')[0] || new Date().toISOString().split('T')[0];
            const name = utils.getDayName(date);
            const temp = Math.round(day.main?.temp ?? 18);
            const min = Math.round(day.main?.temp_min ?? temp - 4);
            const id = day.weather?.[0]?.id ?? 800;
            const icon = day.weather?.[0]?.icon ?? '01d';
            const emoji = utils.getWeatherEmoji(id, icon);

            return `
        <div class="forecast-day">
          <div class="day-name">${name}</div>
          <span class="day-icon">${emoji}</span>
          <div class="day-temp">
            ${temp}${unit}
            <span class="min"> / ${min}</span>
          </div>
        </div>
      `;
        }).join('');
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.WeatherWidget = WeatherWidget;
