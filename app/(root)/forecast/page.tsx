'use client'

import { useState, useEffect } from 'react';

export default function ForecastPage() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        const response = await fetch('/api/weather?lat=33.44&lon=-94.04'); // Sample coordinates (change with dynamic location)
        const data = await response.json();
        setForecast(data);
      } catch (error) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForecast();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Weather Forecast</h1>
      <div>
        {forecast?.daily?.map((day: any, index: number) => (
          <div key={index} className="weather-card">
            <h3>{new Date(day.dt * 1000).toLocaleDateString()}</h3>
            <p>{day.weather[0]?.description}</p>
            <p>Temperature: {day.temp.day}°C</p>
            <p>Humidity: {day.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}
