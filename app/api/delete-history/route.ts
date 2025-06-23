// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { bcms } from "@/lib/bcms";


export async function DELETE(request: Request) {
  try {
    const { entryId } = await request.json();

    if (!entryId) {
      return NextResponse.json(
        { success: false, error: "Missing entryId parameter" },
        { status: 400 }
      );
    }

    // Delete the entry from BCMS
    await bcms.entry.deleteById(entryId, "searchhistory");

    return NextResponse.json(
      { success: true, message: "Search history deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting search history:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete search history",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
