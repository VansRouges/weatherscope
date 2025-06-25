import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { 
  ForecastResponse, 
  ProcessedDayForecast, 
  WeatherCondition 
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function with proper typing
export function processForecastData(forecastData: ForecastResponse): ProcessedDayForecast[] {
  const dailyData: Record<string, {
    date: string;
    temps: number[];
    weather: WeatherCondition[];
    humidity: number[];
    wind: number[];
  }> = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        temps: [],
        weather: [],
        humidity: [],
        wind: []
      };
    }

    dailyData[date].temps.push(item.main.temp);
    dailyData[date].weather.push(item.weather[0]);
    dailyData[date].humidity.push(item.main.humidity);
    dailyData[date].wind.push(item.wind.speed);
  });

  // Helper to find the most common weather condition by id
  function getMostCommonWeather(weatherArr: WeatherCondition[]): WeatherCondition {
    const countMap: Record<number, { count: number, weather: WeatherCondition }> = {};
    for (const w of weatherArr) {
      if (!countMap[w.id]) {
        countMap[w.id] = { count: 1, weather: w };
      } else {
        countMap[w.id].count++;
      }
    }
    // Find the weather id with the highest count
    let max = 0;
    let mostCommon: WeatherCondition = weatherArr[0];
    for (const key in countMap) {
      if (countMap[key].count > max) {
        max = countMap[key].count;
        mostCommon = countMap[key].weather;
      }
    }
    return mostCommon;
  }

  // Process each day's data
  return Object.values(dailyData).map(day => {
    const mostCommonWeather = getMostCommonWeather(day.weather);

    return {
      date: day.date,
      temp_min: Math.min(...day.temps),
      temp_max: Math.max(...day.temps),
      temp_avg: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
      weather: mostCommonWeather,
      humidity_avg: day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length,
      wind_avg: day.wind.reduce((a, b) => a + b, 0) / day.wind.length
    };
  }).slice(0, 5); // Return only next 5 days
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return "just now";
  if (seconds < 60) return "less than a minute ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getWindDirection = (deg: number) => {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  return directions[Math.round(deg / 22.5) % 16];
};