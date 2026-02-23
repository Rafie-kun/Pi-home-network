import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  time?: string;
}

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Update Pi OS security patches', completed: false, priority: 'high', time: '09:00' },
    { id: '2', title: 'Review n8n workflow logs', completed: true, priority: 'medium', time: '10:30' },
    { id: '3', title: 'Backup system configurations', completed: false, priority: 'medium', time: '14:00' },
    { id: '4', title: 'Monitor CPU temperature trends', completed: false, priority: 'low', time: '16:00' },
    { id: '5', title: 'Test new automation workflow', completed: true, priority: 'high', time: '11:00' },
  ]);

  const [newTask, setNewTask] = useState('');

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'medium'
      }]);
      setNewTask('');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  const priorityColors = {
    high: 'text-red-400 border-red-500/30',
    medium: 'text-amber-400 border-amber-500/30',
    low: 'text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-semibold text-white">Today's Agenda</h3>
        </div>
        <div className="text-sm text-violet-300">
          {completedCount}/{tasks.length} done
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
        {tasks.map(task => (
          <div 
            key={task.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border
              ${task.completed ? 'border-slate-700/50 opacity-60' : priorityColors[task.priority]}
              hover:bg-slate-700/50 transition-all cursor-pointer
            `}
            onClick={() => toggleTask(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                {task.title}
              </p>
              {task.time && (
                <p className="text-xs text-slate-400 mt-0.5">{task.time}</p>
              )}
            </div>
            <div className={`
              px-2 py-0.5 rounded text-xs font-medium
              ${task.priority === 'high' ? 'bg-red-500/20 text-red-300' : ''}
              ${task.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : ''}
              ${task.priority === 'low' ? 'bg-emerald-500/20 text-emerald-300' : ''}
            `}>
              {task.priority}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add new task..."
          className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
