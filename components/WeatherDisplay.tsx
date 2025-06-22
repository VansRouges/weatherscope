"use client";
import { useState } from "react";
import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  MapPin,
  RefreshCw,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
}

interface WeatherDisplayProps {
  initialData: WeatherData;
  locationId?: string; // Add locationId prop
}

export default function WeatherDisplay({ initialData }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState(initialData);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/weather?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`);
      if (!response.ok) throw new Error('Refresh failed');
      const newData = await response.json();
      setWeatherData(newData);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };


  // Helper functions
  const convertTemp = (temp: number) => {
    if (tempUnit === "F") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = [
      "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];
    return directions[Math.round(deg / 22.5) % 16];
  };

  const getWeatherIcon = (main: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      Clear: Cloud, // Replace with Sun icon if available
      Clouds: Cloud,
      Rain: Droplets,
      Snow: Cloud, // Replace with Snowflake if available
      Thunderstorm: Cloud, // Replace with Lightning if available
      Drizzle: Droplets,
      Mist: Cloud,
      Fog: Cloud,
      Haze: Cloud,
    };
    return iconMap[main] || Cloud;
  };

  const WeatherIcon = getWeatherIcon(initialData.weather[0].main);

  if (!initialData) return <div className="text-center p-4">No weather data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData.name}, {initialData.sys.country}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {initialData.coord.lat.toFixed(4)}°, {initialData.coord.lon.toFixed(4)}°
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
            >
              °{tempUnit}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Main Weather Card */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <WeatherIcon className="w-16 h-16" />
                  <div>
                    <div className="text-5xl font-bold">
                      {convertTemp(initialData.main.temp)}°{tempUnit}
                    </div>
                    <div className="text-blue-100 text-lg capitalize">
                      {initialData.weather[0].description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-blue-100">
                  <span className="flex items-center space-x-1">
                    <Thermometer className="w-4 h-4" />
                    <span>
                      Feels like {convertTemp(initialData.main.feels_like)}°{tempUnit}
                    </span>
                  </span>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="flex items-center space-x-2 text-blue-100">
                  <ArrowUp className="w-4 h-4" />
                  <span>{convertTemp(initialData.main.temp_max)}°</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <ArrowDown className="w-4 h-4" />
                  <span>{convertTemp(initialData.main.temp_min)}°</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {initialData.main.humidity}%
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${initialData.main.humidity}%` }}
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
                {initialData.wind.speed} m/s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {getWindDirection(initialData.wind.deg)} • Gust {initialData.wind.gust || 0} m/s
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
                {initialData.main.pressure} hPa
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {initialData.main.sea_level ? `Sea level: ${initialData.main.sea_level} hPa` : ''}
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
                {(initialData.visibility / 1000).toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {initialData.visibility >= 10000 ? "Excellent" : "Good"}
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
                    {formatTime(initialData.sys.sunrise)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sunset className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600 dark:text-gray-300">Sunset</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(initialData.sys.sunset)}
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
                  {initialData.clouds.all}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gray-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${initialData.clouds.all}%` }}
                  />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {initialData.weather[0].main}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date(initialData.dt * 1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
}