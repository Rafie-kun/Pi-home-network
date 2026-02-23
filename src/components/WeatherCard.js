import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '🌑',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

// DEMO DATA — replace with live API when key is set
const DEMO = {
  name: 'San Francisco',
  main: { temp: 18.4, feels_like: 16.2, humidity: 72, pressure: 1015 },
  weather: [{ description: 'partly cloudy', icon: '02d' }],
  wind: { speed: 4.2 },
  visibility: 10000,
};

export default function WeatherCard({ config }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!config.WEATHER_API_KEY || config.WEATHER_API_KEY === '') {
        // Use demo data when no key provided
        setTimeout(() => { setData(DEMO); setLoading(false); }, 600);
        return;
      }
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(config.WEATHER_CITY)}&appid=${config.WEATHER_API_KEY}&units=metric`
        );
        setData(res.data);
      } catch (e) {
        setError('Weather unavailable');
        setData(DEMO);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [config]);

  return (
    <div className="card" style={{ animationDelay: '0.05s' }}>
      <div className="card-header">
        <span className="card-title">WEATHER</span>
        <span className="card-icon">◈</span>
      </div>

      {loading ? (
        <div className="loading-dots"><span/><span/><span/></div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="weather-temp">
                {Math.round(data.main.temp)}<sup>°C</sup>
              </div>
              <div className="weather-desc">{data.weather[0].description}</div>
              <div className="weather-city">📍 {data.name}</div>
            </div>
            <div className="weather-icon-large">
              {WEATHER_ICONS[data.weather[0].icon] || '🌤️'}
            </div>
          </div>

          <div className="weather-grid">
            <div className="weather-stat">
              <div className="weather-stat-label">Feels Like</div>
              <div className="weather-stat-val">{Math.round(data.main.feels_like)}°</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">Humidity</div>
              <div className="weather-stat-val">{data.main.humidity}%</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">Wind</div>
              <div className="weather-stat-val">{data.wind.speed} m/s</div>
            </div>
            <div className="weather-stat">
              <div className="weather-stat-label">Pressure</div>
              <div className="weather-stat-val">{data.main.pressure} hPa</div>
            </div>
          </div>
          {error && <p style={{fontSize:'9px',color:'var(--yellow)',marginTop:'8px',letterSpacing:'0.05em'}}>⚠ DEMO DATA — add API key to .env</p>}
        </>
      )}
    </div>
  );
}
