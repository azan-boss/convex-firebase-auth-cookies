import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string[] } }
) {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    // Access the first segment of the ID from the array
    const idDict = await params
    const  id=idDict.id[0]
    console.log(id);
    
    const course = await convex.query(api.course.getCourse, { id });
    const course1=course[0]
    return NextResponse.json({ id,course1 });
}