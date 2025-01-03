import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string[] } }
) {
    // Access the first segment of the ID from the array
    const courseId = params.id;
    console.log(courseId);
    
    return NextResponse.json({ courseId });

}