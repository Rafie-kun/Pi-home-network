import { useState, useEffect } from 'react';
import { Cloud, Droplets, Wind, Eye } from 'lucide-react';

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 22,
    feels_like: 20,
    humidity: 65,
    wind_speed: 12,
    description: 'Partly Cloudy',
    city: 'London',
    icon: '🌤️'
  });

  useEffect(() => {
    // Simulate weather updates
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temp: 18 + Math.random() * 10,
        feels_like: 16 + Math.random() * 10,
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-5xl font-bold text-white mb-1">
            {weather.temp.toFixed(0)}°C
          </div>
          <p className="text-amber-200 font-medium">{weather.description}</p>
          <p className="text-amber-300/70 text-sm flex items-center gap-1 mt-1">
            <Cloud className="w-3 h-3" />
            {weather.city}
          </p>
        </div>
        <div className="text-6xl">{weather.icon}</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-amber-400/20">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-amber-300" />
          <div>
            <p className="text-xs text-amber-200/70">Humidity</p>
            <p className="text-sm font-semibold text-white">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-amber-300" />
          <div>
            <p className="text-xs text-amber-200/70">Wind</p>
            <p className="text-sm font-semibold text-white">{weather.wind_speed.toFixed(1)} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-300" />
          <div>
            <p className="text-xs text-amber-200/70">Feels</p>
            <p className="text-sm font-semibold text-white">{weather.feels_like.toFixed(0)}°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}
