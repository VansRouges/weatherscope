import { notFound } from 'next/navigation';
import WeatherDisplay from '@/components/WeatherDisplay';
import RefreshButton from '@/components/RefreshButton';
import { Suspense } from 'react';
import WeatherSkeleton from '@/components/WeatherSkeleton';

interface ForecastPageProps {
  params: { id: string };
  searchParams: { refresh?: string };
}

async function getWeatherData(lat: number, lon: number, forceRefresh = false) {
    try {
      // Ensure API key is properly set in the environment
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) throw new Error('API key not configured');
      
      // Prepend the full base URL to the internal API call
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`; // Pass the API key if needed
      
      const response = await fetch(url, {
        next: { revalidate: forceRefresh ? 0 : 3600 }, // 1 hour cache
      });
      console.log('Fetching weather data from:', url);
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`Weather data fetch failed with status ${response.status}`);
      }
  
      return await response.json(); // Return weather data from your API
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error; // Propagate error for handling further up the call stack
    }
  }
  
  

export default async function ForecastPage({ 
  params, 
  searchParams 
}: ForecastPageProps) {
  // First await the params promise
  const { id } = await params;
  console.log('Forecast page params:', id);

  const [lat, lon] = id.split('--').map(Number);
  
  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    return notFound();
  }

  // Then await the searchParams promise
  const awaitedSearchParams = await searchParams;
  const forceRefresh = awaitedSearchParams.refresh === 'true';

  try {
    const weatherData = await getWeatherData(lat, lon, forceRefresh);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weather Forecast</h1>
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