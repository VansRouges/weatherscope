// app/api/weather/route.ts
import { NextResponse } from "next/server";
import axios from 'axios';
import { rateLimiter } from '@/lib/rate-limiter';
import type { 
  CurrentWeatherResponse, 
  ForecastResponse, 
} from '@/types';
import { processForecastData } from "@/lib/utils";


export async function GET(request: Request) {
  try {
    // Rate limiting check
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const { success, limit, remaining, reset } = await rateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          limit,
          remaining,
          reset: new Date(reset).toISOString() 
        },
        { status: 429, headers: { 'Retry-After': '10' } }
      );
    }

    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const apiKey = process.env.OPENWEATHER_API_KEY as string;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenWeather API key not configured' },
        { status: 500 }
      );
    }

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and Longitude are required' },
        { status: 400 }
      );
    }

    // Current weather endpoint
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    // 5-day forecast endpoint (3-hour intervals)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Fetch both current weather and forecast with proper typing
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get<CurrentWeatherResponse>(currentUrl),
      axios.get<ForecastResponse>(forecastUrl)
    ]);

    // Process forecast data to group by day
    const dailyForecasts = processForecastData(forecastResponse.data);

    return NextResponse.json({
      current: currentResponse.data,
      forecast: dailyForecasts
    }, {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString()
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Unknown error';
    let errorDetails = {};
    let status = 500;

    if (axios.isAxiosError(error)) {
      errorMessage = error.message;
      errorDetails = error.response?.data || error.message;
      status = error.response?.status || 500;
      console.error('Error details:', errorDetails);
    } else if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error message:', errorMessage);
      errorDetails = error.message;
      console.error('Error details:', error.message);
    } else {
      console.error('Error details:', error);
    }

    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        details: errorDetails 
      },
      { status }
    );
  }
}