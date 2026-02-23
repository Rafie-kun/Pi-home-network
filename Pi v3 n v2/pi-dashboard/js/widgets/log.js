/**
 * Log Widget — System activity log
 */
const LogWidget = {
    init() {
        // Clear button
        const clearBtn = document.getElementById('clear-log');
        if (clearBtn) {
            clearBtn.onclick = () => {
                const body = document.getElementById('log-body');
                if (body) body.innerHTML = '';
                utils.addLog('Log cleared', 'info');
            };
        }

        utils.addLog('System log initialized', 'success');
        utils.addLog('Dashboard started in demo mode', 'info');
        utils.addLog('Fetching live data from APIs...', 'info');
    }
};

window.LogWidget = LogWidget;
