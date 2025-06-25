"use client";
import { useState } from "react";
// import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { WeatherHeader } from "./WeatherHeader";
import { WeatherMainCard } from "./WeatherMainCard";
import { ForecastCard } from "./ForecastCard";
import { WeatherApiResponse } from "@/types/weather";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatTime, getWindDirection } from "@/lib/utils";
import { Cloud, Droplets, Eye, Gauge, Sunrise, Sunset, Wind } from "lucide-react";

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
         {/* Weather Details Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Humidity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Humidity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData?.current?.main.humidity}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${initialData.current?.main.humidity}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Wind */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                <Wind className="w-4 h-4 text-green-500" />
                <span>Wind</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData.current?.wind.speed} m/s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {getWindDirection(initialData.current?.wind.deg)} • Gust {initialData.current?.wind.gust || 0} m/s
              </div>
            </CardContent>
          </Card>

          {/* Pressure */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-purple-500" />
                <span>Pressure</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData.current?.main.pressure} hPa
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {initialData.current?.main.sea_level ? `Sea level: ${initialData.current?.main.sea_level} hPa` : ''}
              </div>
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                <Eye className="w-4 h-4 text-orange-500" />
                <span>Visibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {(initialData.current?.visibility / 1000).toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {initialData.current?.visibility >= 10000 ? "Excellent" : "Good"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sun Times and Cloud Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sun Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sunrise className="w-5 h-5 text-yellow-500" />
                <span>Sun Times</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sunrise className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600 dark:text-gray-300">Sunrise</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(initialData.current?.sys.sunrise)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sunset className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600 dark:text-gray-300">Sunset</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(initialData.current?.sys.sunset)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cloud Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-gray-500" />
                <span>Cloud Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {initialData.current?.clouds.all}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gray-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${initialData.current?.clouds.all}%` }}
                  />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {initialData.current?.weather[0].main}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

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