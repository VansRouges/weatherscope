import { notFound } from 'next/navigation';
import WeatherDisplay from '@/components/WeatherDisplay';
import RefreshButton from '@/components/RefreshButton';
import { Suspense } from 'react';
import WeatherSkeleton from '@/components/WeatherSkeleton';

interface ForecastPageProps {
  params: { id: string };
  searchParams: { refresh?: string };
}

export default async function ForecastPage({ 
  params, 
  searchParams 
}: ForecastPageProps) {
  const [lat, lon] = params.id.split('--').map(Number);
  
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return notFound();
  }

  // Force refresh if requested
  const weatherData = await getWeatherData(lat, lon, searchParams.refresh === 'true');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <RefreshButton />
      </div>
      
      <Suspense fallback={<WeatherSkeleton />}>
        <WeatherDisplay data={weatherData} />
      </Suspense>
    </div>
  );
}

async function getWeatherData(lat: number, lon: number, forceRefresh = false) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url, {
      next: { revalidate: forceRefresh ? 0 : 3600 } // 1 hour cache
    });
    
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}