"use client";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import WeatherIcon from "./WeatherIcon";
import { Button } from "./ui/button";
import { useState } from "react";

interface WeatherData {
  current: {
    temp: number;
    weather: { main: string; description: string }[];
    humidity: number;
    wind_speed: number;
    dt: number;
  };
  daily: {
    dt: number;
    temp: { min: number; max: number };
    weather: { main: string; description: string }[];
  }[];
}

export default function WeatherDisplay({ data }: { data: WeatherData }) {
  const [showHourly, setShowHourly] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Current Weather
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowHourly(!showHourly)}
          >
            {showHourly ? 'Show Daily' : 'Show Hourly'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showHourly ? (
          <HourlyForecast data={data} />
        ) : (
          <DailyForecast data={data} />
        )}
      </CardContent>
    </Card>
  );
}

function HourlyForecast({ data }: { data: WeatherData }) {
  // Implement hourly forecast view
  return <div>Hourly forecast coming soon</div>;
}

function DailyForecast({ data }: { data: WeatherData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.daily.slice(0, 6).map((day, index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">
              {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short' })}
            </h3>
            <WeatherIcon type={getWeatherIconType(day.weather[0].main)} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-lg font-bold">
              {Math.round(day.temp.max)}°C
            </span>
            <span className="text-muted-foreground">
              {Math.round(day.temp.min)}°C
            </span>
          </div>
          <p className="text-sm capitalize mt-1">
            {day.weather[0].description}
          </p>
        </div>
      ))}
    </div>
  );
}

function getWeatherIconType(weatherMain: string): string {
  const map: Record<string, string> = {
    Clear: 'sun',
    Clouds: 'cloud',
    Rain: 'rain',
    Snow: 'snow',
    Thunderstorm: 'storm',
  };
  return map[weatherMain] || 'sun';
}