// types/weather.ts
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CurrentWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
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

export interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  temp_avg: number;
  weather: WeatherCondition;
  humidity_avg: number;
  wind_avg: number;
}

export interface WeatherApiResponse {
  current: CurrentWeatherResponse;
  forecast: ForecastDay[];
}

export interface WeatherDisplayProps {
  initialData: WeatherApiResponse;
}