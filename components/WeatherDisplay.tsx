"use client";
import { useState } from "react";
// import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherMainCard } from "./WeatherMainCard";
import { ForecastCard } from "./ForecastCard";
import { WeatherApiResponse } from "@/types/weather";

export default function WeatherDisplay({ initialData }: { initialData: WeatherApiResponse }) {
  const [weatherData, setWeatherData] = useState(initialData);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/weather?lat=${weatherData.current.coord.lat}&lon=${weatherData.current.coord.lon}`);
      if (!response.ok) throw new Error('Refresh failed');
      const newData = await response.json();
      setWeatherData(newData);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const convertTemp = (temp: number) => {
    if (tempUnit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  // const formatTime = (timestamp: number) => {
  //   return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  // };

  if (!weatherData) return <div className="text-center p-4">No weather data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <WeatherHeader
          name={weatherData.current.name}
          country={weatherData.current.sys.country}
          lat={weatherData.current.coord.lat}
          lon={weatherData.current.coord.lon}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          tempUnit={tempUnit}
          onToggleUnit={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
        />

        <WeatherMainCard
          temp={convertTemp(weatherData.current.main.temp)}
          feelsLike={convertTemp(weatherData.current.main.feels_like)}
          tempMin={convertTemp(weatherData.current.main.temp_min)}
          tempMax={convertTemp(weatherData.current.main.temp_max)}
          description={weatherData.current.weather[0].description}
          tempUnit={tempUnit}
          weatherMain={weatherData.current.weather[0].main}
        />

        {/* Forecast Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">5-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weatherData.forecast.map((day) => (
              <ForecastCard
                key={day.date}
                date={day.date}
                temp_min={convertTemp(day.temp_min)}
                temp_max={convertTemp(day.temp_max)}
                weather={{
                  main: day.weather.main,
                  description: day.weather.description
                }}
                tempUnit={tempUnit}
              />
            ))}
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {format(new Date(weatherData.current.dt * 1000), "PPPp")}
        </div>
      </div>
    </div>
  );
}