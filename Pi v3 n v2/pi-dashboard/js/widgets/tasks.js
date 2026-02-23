/**
 * Tasks Widget — Local task management with optional Notion sync
 */
const TasksWidget = {
    _tasks: [],
    _storageKey: 'pi_dashboard_tasks',

    init() {
        this._loadTasks();
        this._renderTasks();
        this._setupModal();
        utils.addLog('Tasks widget initialized', 'success');
    },

    _loadTasks() {
        const saved = localStorage.getItem(this._storageKey);
        if (saved) {
            this._tasks = JSON.parse(saved);
        } else {
            // Default tasks to give a nice first-run experience
            this._tasks = [
                { id: '1', title: 'Review PR #421 — glassmorphism updates', priority: 'high', category: 'Dev', time: '', done: true, created: new Date().toISOString() },
                { id: '2', title: 'Adjust Pi 5 fan speed curve in config', priority: 'medium', category: 'System', time: '', done: false, created: new Date().toISOString() },
                { id: '3', title: 'Backup Home Assistant database', priority: 'high', category: 'Maintenance', time: '14:00', done: false, created: new Date().toISOString() },
                { id: '4', title: 'Weekly Sprint Planning', priority: 'medium', category: 'Work', time: '15:00', done: false, created: new Date().toISOString() },
                { id: '5', title: 'Update n8n workflows documentation', priority: 'low', category: 'Docs', time: '', done: false, created: new Date().toISOString() },
                { id: '6', title: 'Test Jellyfin on Pi 5', priority: 'low', category: 'Media', time: '', done: false, created: new Date().toISOString() },
            ];
            this._saveTasks();
        }
    },

    _saveTasks() {
        localStorage.setItem(this._storageKey, JSON.stringify(this._tasks));
    },

    _renderTasks() {
        const container = document.getElementById('tasks-list');
        if (!container) return;

        if (this._tasks.length === 0) {
            container.innerHTML = `
        <div style="text-align:center; padding:20px 0; color:var(--text-muted);">
          <span class="material-symbols-outlined" style="font-size:28px; display:block; margin-bottom:8px; opacity:0.3;">check_circle</span>
          All done! Add a task above.
        </div>
      `;
            this._updateProgress(0, 0);
            return;
        }

        // Sort: undone first, then done; within each group, high > medium > low
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const sorted = [...this._tasks].sort((a, b) => {
            if (a.done !== b.done) return a.done ? 1 : -1;
            return (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
        });

        container.innerHTML = sorted.map(task => `
      <div class="task-item ${task.done ? 'done' : ''}" data-id="${task.id}">
        <input 
          type="checkbox"
          class="task-checkbox"
          ${task.done ? 'checked' : ''}
          onchange="TasksWidget._toggleTask('${task.id}')"
        />
        <div class="task-content">
          <div class="task-title">${this._escape(task.title)}</div>
          <div class="task-meta">
            <span class="task-priority ${task.priority}">${task.priority}</span>
            ${task.category ? `<span class="task-category">${this._escape(task.category)}</span>` : ''}
            ${task.time ? `<span class="task-time"><span class="material-symbols-outlined" style="font-size:10px">schedule</span>${task.time}</span>` : ''}
          </div>
        </div>
        <button class="task-delete" onclick="TasksWidget._deleteTask('${task.id}')" title="Delete task">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    `).join('');

        // Update progress
        const done = this._tasks.filter(t => t.done).length;
        const total = this._tasks.length;
        this._updateProgress(done, total);
    },

    _updateProgress(done, total) {
        const fill = document.getElementById('tasks-progress-fill');
        const summary = document.getElementById('tasks-summary');

        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        if (fill) fill.style.width = `${pct}%`;

        if (summary) {
            const remaining = total - done;
            if (remaining === 0) {
                summary.textContent = '🎉 All tasks complete!';
                summary.style.color = 'var(--neon-green)';
            } else {
                summary.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining · ${pct}% done`;
                summary.style.color = 'var(--text-muted)';
            }
        }
    },

    _toggleTask(id) {
        const task = this._tasks.find(t => t.id === id);
        if (!task) return;
        task.done = !task.done;
        this._saveTasks();
        this._renderTasks();
        utils.addLog(`Task ${task.done ? 'completed' : 'reopened'}: "${task.title}"`, 'info');
        if (task.done) utils.showToast(`Task done: ${task.title}`, 'success');
    },

    _deleteTask(id) {
        const task = this._tasks.find(t => t.id === id);
        if (!task) return;
        this._tasks = this._tasks.filter(t => t.id !== id);
        this._saveTasks();
        this._renderTasks();
        utils.addLog(`Task deleted: "${task.title}"`, 'info');
    },

    addTask(title, priority, category, time) {
        if (!title.trim()) return;

        const task = {
            id: Date.now().toString(),
            title: title.trim(),
            priority: priority || 'medium',
            category: category || '',
            time: time || '',
            done: false,
            created: new Date().toISOString(),
        };

        this._tasks.unshift(task);
        this._saveTasks();
        this._renderTasks();

        utils.addLog(`Task added: "${task.title}"`, 'success');
        utils.showToast('Task added!', 'success');
    },

    _setupModal() {
        const addBtn = document.getElementById('add-task-btn');
        const modal = document.getElementById('task-modal');
        const closeBtn = document.getElementById('task-close');
        const cancelBtn = document.getElementById('task-cancel');
        const addTaskBtn = document.getElementById('task-add-btn');
        const titleInput = document.getElementById('new-task-title');

        if (addBtn) addBtn.onclick = () => { modal.classList.remove('hidden'); titleInput.focus(); };
        if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
        if (cancelBtn) cancelBtn.onclick = () => modal.classList.add('hidden');

        if (addTaskBtn) {
            addTaskBtn.onclick = () => {
                const title = titleInput.value;
                const priority = document.getElementById('new-task-priority').value;
                const category = document.getElementById('new-task-category').value;
                const time = document.getElementById('new-task-time').value;

                if (!title.trim()) {
                    utils.showToast('Please enter a task title', 'warning');
                    return;
                }

                this.addTask(title, priority, category, time);
                modal.classList.add('hidden');

                // Reset form
                titleInput.value = '';
                document.getElementById('new-task-category').value = '';
                document.getElementById('new-task-time').value = '';
                document.getElementById('new-task-priority').value = 'medium';
            };
        }

        // Enter key to submit
        if (titleInput) {
            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') addTaskBtn?.click();
            });
        }

        // Click outside to close
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.add('hidden');
            });
        }
    },

    _escape(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
};

window.TasksWidget = TasksWidget;
