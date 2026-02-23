import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Send } from 'lucide-react';

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export function TerminalSimulator() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Pi5 Terminal Simulator' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' },
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setLines(prev => [...prev, { type: 'command', content: `pi@raspberrypi:~ $ ${trimmed}` }]);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    const output = getCommandOutput(trimmed);
    setLines(prev => [...prev, ...output]);
    setCurrentCommand('');
  };

  const getCommandOutput = (cmd: string): TerminalLine[] => {
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];

    switch (command) {
      case 'help':
        return [
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help          - Show this help message' },
          { type: 'output', content: '  ls            - List directory contents' },
          { type: 'output', content: '  pwd           - Print working directory' },
          { type: 'output', content: '  uname         - System information' },
          { type: 'output', content: '  uptime        - System uptime' },
          { type: 'output', content: '  df -h         - Disk usage' },
          { type: 'output', content: '  free -h       - Memory usage' },
          { type: 'output', content: '  top           - Process monitor' },
          { type: 'output', content: '  ifconfig      - Network configuration' },
          { type: 'output', content: '  docker ps     - Docker containers' },
          { type: 'output', content: '  systemctl     - Service manager' },
          { type: 'output', content: '  clear         - Clear screen' },
          { type: 'output', content: '' },
        ];

      case 'ls':
        return [
          { type: 'output', content: 'Desktop  Documents  Downloads  Music  Pictures  Videos  pi-dashboard  n8n-data' },
          { type: 'output', content: '' },
        ];

      case 'pwd':
        return [
          { type: 'output', content: '/home/pi' },
          { type: 'output', content: '' },
        ];

      case 'uname':
        if (parts.includes('-a')) {
          return [
            { type: 'output', content: 'Linux raspberrypi 6.1.21-v8+ #1642 SMP PREEMPT Mon Apr  3 17:24:16 BST 2023 aarch64 GNU/Linux' },
            { type: 'output', content: '' },
          ];
        }
        return [
          { type: 'output', content: 'Linux' },
          { type: 'output', content: '' },
        ];

      case 'uptime':
        return [
          { type: 'output', content: ' 14:23:45 up 7 days, 12:45,  1 user,  load average: 0.24, 0.31, 0.28' },
          { type: 'output', content: '' },
        ];

      case 'df':
        return [
          { type: 'output', content: 'Filesystem      Size  Used Avail Use% Mounted on' },
          { type: 'output', content: '/dev/mmcblk0p2  234G   68G  155G  31% /' },
          { type: 'output', content: '/dev/mmcblk0p1  256M   50M  206M  20% /boot' },
          { type: 'output', content: '' },
        ];

      case 'free':
        return [
          { type: 'output', content: '              total        used        free      shared  buff/cache   available' },
          { type: 'output', content: 'Mem:           7.8G        4.2G        1.2G        256M        2.4G        3.2G' },
          { type: 'output', content: 'Swap:          2.0G        512M        1.5G' },
          { type: 'output', content: '' },
        ];

      case 'top':
        return [
          { type: 'output', content: 'top - 14:23:45 up 7 days, 12:45,  1 user,  load average: 0.24, 0.31, 0.28' },
          { type: 'output', content: 'Tasks: 124 total,   1 running, 123 sleeping,   0 stopped,   0 zombie' },
          { type: 'output', content: '%Cpu(s):  24.5 us,  8.2 sy,  0.0 ni, 65.8 id,  1.2 wa,  0.0 hi,  0.3 si,  0.0 st' },
          { type: 'output', content: 'MiB Mem :   7956.0 total,   1234.5 free,   4321.2 used,   2400.3 buff/cache' },
          { type: 'output', content: '' },
        ];

      case 'ifconfig':
        return [
          { type: 'output', content: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500' },
          { type: 'output', content: '        inet 192.168.1.104  netmask 255.255.255.0  broadcast 192.168.1.255' },
          { type: 'output', content: '        inet6 fe80::dea6:32ff:fe4c:8b5a  prefixlen 64  scopeid 0x20<link>' },
          { type: 'output', content: '' },
        ];

      case 'docker':
        if (parts.includes('ps')) {
          return [
            { type: 'output', content: 'CONTAINER ID   IMAGE              STATUS         PORTS                    NAMES' },
            { type: 'output', content: 'a3f7b918c2e1   n8nio/n8n:latest   Up 7 days      0.0.0.0:5678->5678/tcp   n8n' },
            { type: 'output', content: '8c2e1d4f9a2c   pihole/pihole      Up 12 days     0.0.0.0:53->53/tcp       pihole' },
            { type: 'output', content: '' },
          ];
        }
        return [{ type: 'error', content: 'Usage: docker [OPTIONS] COMMAND' }, { type: 'output', content: '' }];

      case 'systemctl':
        return [
          { type: 'output', content: '● raspberrypi' },
          { type: 'output', content: '    State: running' },
          { type: 'output', content: '     Jobs: 0 queued' },
          { type: 'output', content: '   Failed: 0 units' },
          { type: 'output', content: '' },
        ];

      case 'clear':
        setLines([]);
        return [];

      default:
        return [
          { type: 'error', content: `Command not found: ${command}` },
          { type: 'error', content: 'Type "help" for available commands' },
          { type: 'output', content: '' },
        ];
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(newIndex === commandHistory.length - 1 ? '' : commandHistory[newIndex]);
      }
    }
  };

  const quickCommands = ['help', 'ls', 'uname -a', 'uptime', 'df -h', 'free -h', 'docker ps', 'clear'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TerminalIcon className="w-6 h-6 text-emerald-400" />
          Pi Terminal Simulator
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm text-slate-400">Connected</span>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="flex flex-wrap gap-2">
        {quickCommands.map(cmd => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors font-mono"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-sm text-slate-400 font-mono ml-4">pi@raspberrypi:~</span>
        </div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="p-4 h-96 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`
                ${line.type === 'command' ? 'text-emerald-400 font-semibold' : ''}
                ${line.type === 'output' ? 'text-slate-300' : ''}
                ${line.type === 'error' ? 'text-red-400' : ''}
              `}
            >
              {line.content}
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <div className="border-t border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-mono text-sm flex-shrink-0">
              pi@raspberrypi:~ $
            </span>
            <input
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none"
              placeholder="Type a command..."
              autoFocus
            />
            <button
              onClick={() => executeCommand(currentCommand)}
              className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">
        Use ↑↓ arrow keys to navigate command history
      </p>
    </div>
  );
}
