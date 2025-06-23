import { NextResponse } from "next/server";
import { bcms } from "@/lib/bcms";
// import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    // const { userId } = await auth()
    
    try {
        // Parse the request body
        const body = await request.json();

        // Validate required fields
        if (!body.locationName || typeof body.lat !== 'number' || typeof body.lon !== 'number' || typeof body.temperature !== 'number' || typeof body.userId === undefined) {
            return NextResponse.json(
                { success: false, error: "Missing required fields (locationName, lat, lon, temperature)" },
                { status: 400 }
            );
        }

        // Generate a slug from location name (removed timestamp as requested)
        const slug = body.locationName.toLowerCase().replace(/\s+/g, '-');
        
        // Create the search history entry
        const newHistory = await bcms.entry.create("searchhistory", {
            content: [],
            statuses: [],
            meta: [
                {
                    lng: "en",
                    data: {
                        title: body.locationName, // Removed "Search for" prefix
                        slug: slug,
                        locationname: body.locationName,
                        lat: body.lat,
                        lon: body.lon,
                        temperature: body.temperature,
                        timestamp: new Date().toISOString(), // Store as ISO string
                        userid: body.userId || "guest" // Use "guest" if no user ID
                    },
                },
            ],
        });
        console.log("userId:", body.userId);
        return NextResponse.json({ 
            success: true, 
            data: newHistory 
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating search history:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to create search history",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}