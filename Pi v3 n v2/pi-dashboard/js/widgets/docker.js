/**
 * Docker / Services Widget — Container status display
 */
const DockerWidget = {
    _interval: null,

    async init() {
        await this.refresh();
        const cfg = utils.getConfig();
        this._interval = setInterval(() => this.refresh(), 60000);
    },

    async refresh() {
        try {
            const containers = await API.getContainers();
            this.render(containers);
        } catch (e) {
            utils.addLog(`Docker widget error: ${e.message}`, 'error');
        }
    },

    render(containers) {
        const list = document.getElementById('docker-list');
        const count = document.getElementById('docker-count');
        if (!list) return;

        const running = containers.filter(c => c.status === 'running').length;
        if (count) count.textContent = `${running}/${containers.length} running`;

        list.innerHTML = containers.map(c => {
            const isRunning = c.status === 'running';
            const statusColor = isRunning ? 'var(--neon-green)' : '#ef4444';
            const shortImage = c.image?.split('/').pop()?.split(':')[0] || c.name;

            return `
        <div class="docker-item">
          <div class="docker-icon">
            <span class="material-symbols-outlined">deployed_code</span>
          </div>
          <div class="docker-name">${c.name}</div>
          ${c.port ? `<span class="docker-port">:${c.port}</span>` : ''}
          <div class="service-dot" style="background:${statusColor}; box-shadow: 0 0 6px ${statusColor}50;"></div>
        </div>
      `;
        }).join('');


        utils.addLog(`Docker: ${running} containers running`, 'info');
    },

    destroy() {
        if (this._interval) clearInterval(this._interval);
    }
};

window.DockerWidget = DockerWidget;
