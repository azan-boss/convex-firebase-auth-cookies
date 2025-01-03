import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export async function GET() {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        const course = await convex.query(api.course.getCourses, {});
        console.log(course);

        return NextResponse.json({ message: "Hello, world!" ,course });

    
}