// app/api/location/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { rateLimiter } from '@/lib/rate-limiter';

interface OpenWeatherLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface SimplifiedLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  displayName: string;
}

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
        { 
          status: 429, 
          headers: { 
            'Retry-After': '10',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          } 
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit') || '5';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!query) {
      return NextResponse.json(
        { error: 'Location query is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenWeather API key not configured' },
        { status: 500 }
      );
    }

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=${limitParam}&appid=${apiKey}`;
    const response = await axios.get(url);

    const locations: SimplifiedLocation[] = (response.data as OpenWeatherLocation[]).map((loc) => ({
      name: loc.name,
      lat: loc.lat,
      lon: loc.lon,
      country: loc.country,
      state: loc.state,
      displayName: `${loc.name}${loc.state ? `, ${loc.state}` : ''}, ${loc.country}`
    }));

    return NextResponse.json(locations, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=86400', // Cache for 24 hours
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString()
      }
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