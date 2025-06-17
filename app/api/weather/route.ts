// app/api/weather/route.ts
import { NextResponse } from "next/server";
import axios from 'axios';

export async function GET(request: Request) {
  try {
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

    // Using the more widely supported 2.5 API version
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);

    return NextResponse.json(response.data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        details: error.response?.data || error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}