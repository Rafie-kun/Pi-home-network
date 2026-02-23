import React, { useState, useEffect } from 'react';

// Demo tasks — in production, fetched from Notion API or a local markdown/Obsidian vault
const DEMO_TASKS = [
  { id: 1, text: 'Finish REST API backend for portfolio project', done: false, priority: 'high', source: 'Notion' },
  { id: 2, text: 'Write unit tests for auth module', done: false, priority: 'high', source: 'Notion' },
  { id: 3, text: 'Update README with setup instructions', done: true, priority: 'med', source: 'GitHub' },
  { id: 4, text: 'Deploy dashboard to GitHub Pages', done: false, priority: 'med', source: 'Notion' },
  { id: 5, text: 'Review pull requests from team', done: false, priority: 'low', source: 'GitHub' },
  { id: 6, text: 'Read: Clean Code chapters 8–10', done: true, priority: 'low', source: 'Obsidian' },
];

const TAG_LABEL = { high: 'HIGH', med: 'MED', low: 'LOW' };

export default function TasksCard({ config }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!config.NOTION_TOKEN) {
        setTasks(DEMO_TASKS);
        setDemoMode(true);
        setLoading(false);
        return;
      }
      try {
        // Fetch from backend proxy (Notion API requires server-side call due to CORS)
        const res = await fetch(`/api/tasks`);
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else {
          setTasks(DEMO_TASKS);
          setDemoMode(true);
        }
      } catch {
        setTasks(DEMO_TASKS);
        setDemoMode(true);
      }
      setLoading(false);
    };
    fetchTasks();
  }, [config]);

  const toggle = (id) => {
    setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  };

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div className="card" style={{ animationDelay: '0.15s' }}>
      <div className="card-header">
        <span className="card-title">TODAY'S TASKS · {pending.length} LEFT</span>
        <span className="card-icon">◇</span>
      </div>

      {loading ? (
        <div className="loading-dots"><span/><span/><span/></div>
      ) : (
        <>
          <div className="task-list">
            {[...pending, ...done].map(task => (
              <div
                key={task.id}
                className={`task-item ${task.done ? 'task-item--done' : ''}`}
                onClick={() => toggle(task.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className={`task-checkbox ${task.done ? 'task-checkbox--done' : ''}`}>
                  {task.done && <span className="task-check-icon">✓</span>}
                </div>
                <div className="task-text">{task.text}</div>
                <div className={`task-tag task-tag--${task.priority}`}>{TAG_LABEL[task.priority]}</div>
              </div>
            ))}
          </div>
          <div className="task-source">
            <span>{demoMode ? '⚠ DEMO' : '●'}</span>
            <span>Notion · Obsidian · GitHub</span>
          </div>
        </>
      )}
    </div>
  );
}
