import { notFound } from 'next/navigation';
import WeatherDisplay from '@/components/WeatherDisplay';
import RefreshButton from '@/components/RefreshButton';
import { Suspense } from 'react';
import WeatherSkeleton from '@/components/WeatherSkeleton';
import Link from 'next/link';

interface ForecastPageProps {
  params: { id: string };
  searchParams: { refresh?: string };
}

async function getWeatherData(lat: number, lon: number, forceRefresh = false) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error('API key not configured');
    
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    const response = await fetch(url, {
      next: { revalidate: forceRefresh ? 0 : 3600 },
    });
    
    if (!response.ok) {
      throw new Error(`Weather data fetch failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

async function saveSearchHistory(locationName: string, lat: number, lon: number, temperature: number) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/create-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationName,
        lat,
        lon,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save search history: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

export default async function ForecastPage({ 
  params, 
  searchParams 
}: ForecastPageProps) {
  const { id } = await params;
  console.log('Forecast page params:', id);

  const [lat, lon] = id.split('--').map(Number);
  
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return notFound();
  }

  const awaitedSearchParams = await searchParams;
  const forceRefresh = awaitedSearchParams.refresh === 'true';

  try {
    const weatherData = await getWeatherData(lat, lon, forceRefresh);

    // Save search history after successful weather data fetch
    await saveSearchHistory(
      weatherData?.current?.name, // locationName from weather data
      weatherData?.current?.coord?.lat, // lat from weather data
      weatherData?.current?.coord?.lon, // lon from weather data
      Math?.round(weatherData?.current?.main?.temp), // temperature rounded to nearest integer
    );

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link className="text-2xl font-bold cursor-pointer" href="/">Weather Forecast</Link>
          <RefreshButton />
        </div>
        
        <Suspense fallback={<WeatherSkeleton />}>
          <WeatherDisplay 
            initialData={weatherData} 
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Error rendering forecast page:', error);
    return notFound();
  }
}