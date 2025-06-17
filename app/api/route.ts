import { NextResponse } from "next/server";

// Define a custom error
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function GET() {
  try {
    // Example usage: throw new ApiError("Something went wrong", 400);
    return NextResponse.json(
      {
        message: "Welcome to WeatherScope API",
        description: "This is the main API endpoint for WeatherScope - a weather application built with Next.js & BCMS.",
        endpoints: {
          weather: "/api/weather?lat={latitude}&lon={longitude}",
          documentation: "Coming soon"
        }
      },
      {
        status: 200
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}