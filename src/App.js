import React, { useState, useEffect, useCallback } from 'react';
import WeatherCard from './components/WeatherCard';
import GitHubCard from './components/GitHubCard';
import SystemStatsCard from './components/SystemStatsCard';
import CommitsCard from './components/CommitsCard';
import TasksCard from './components/TasksCard';
import ClockCard from './components/ClockCard';
import './App.css';

const CONFIG = {
  GITHUB_USERNAME: process.env.REACT_APP_GITHUB_USERNAME || 'YOUR_GITHUB_USERNAME',
  GITHUB_TOKEN: process.env.REACT_APP_GITHUB_TOKEN || '',
  WEATHER_API_KEY: process.env.REACT_APP_WEATHER_KEY || '',
  WEATHER_CITY: process.env.REACT_APP_WEATHER_CITY || 'New York',
  NOTION_TOKEN: process.env.REACT_APP_NOTION_TOKEN || '',
  NOTION_DB_ID: process.env.REACT_APP_NOTION_DB_ID || '',
};

export { CONFIG };

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div className={`app ${loaded ? 'app--loaded' : ''}`}>
      <div className="scanlines" />
      <div className="noise" />

      <header className="app-header">
        <div className="header-left">
          <div className="logo-mark">
            <span className="logo-pi">π</span>
          </div>
          <div className="header-titles">
            <h1 className="header-title">COMMAND CENTER</h1>
            <p className="header-sub">Raspberry Pi 5 · Personal Dashboard</p>
          </div>
        </div>
        <ClockCard />
        <div className="header-status">
          <span className="status-dot" />
          <span className="status-text">LIVE</span>
        </div>
      </header>

      <main className="dashboard-grid">
        <div className="grid-col grid-col--left">
          <WeatherCard config={CONFIG} />
          <SystemStatsCard />
          <TasksCard config={CONFIG} />
        </div>

        <div className="grid-col grid-col--center">
          <GitHubCard config={CONFIG} />
        </div>

        <div className="grid-col grid-col--right">
          <CommitsCard config={CONFIG} />
        </div>
      </main>

      <footer className="app-footer">
        <span>SELF-HOSTED · OPEN SOURCE · PI 5</span>
        <span className="footer-sep">◆</span>
        <span>github.com/{CONFIG.GITHUB_USERNAME}/pi-dashboard</span>
      </footer>
    </div>
  );
}

export default App;
