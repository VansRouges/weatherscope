// app/api/get-history/route.ts
import { NextResponse } from "next/server";
import { bcms } from "@/lib/bcms";
import { SearchhistoryEntry } from "@/bcms/types/ts";

export async function GET() {
  try {
    // Fetch all search history entries from BCMS
    const searchHistory = (await bcms.entry.getAll("searchhistory")) as SearchhistoryEntry[];
    
    // Transform the data to match what the component needs
    const transformedData = searchHistory.map(entry => ({
      id: entry._id,
      name: entry?.meta?.en?.locationname,
      lat: entry?.meta?.en?.lat,
      lon: entry?.meta?.en?.lon,
      temp: `${entry?.meta?.en?.temperature}°C`,
      timestamp: entry?.meta?.en?.timestamp // Keep the raw timestamp
    }));

    // Return the transformed data
    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch search history" },
      { status: 500 }
    );
  }
}