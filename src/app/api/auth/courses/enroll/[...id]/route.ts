import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../../convex/_generated/api";

export async function POST(request: NextRequest, { params }: { params: { id: string[] } }) {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

    try {
        // Initialize Firebase Admin first
        await initFirebaseAdmin();
        
        const authToken = request.cookies.get("auth-token")?.value;
        
        if (!authToken) {
            return NextResponse.json({ message: "No auth token provided" }, { status: 401 });
        }

        // Get Firebase auth instance after initialization
        const auth = getAuth();
        const user = await auth.verifyIdToken(authToken);
        
        if (!user) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        // Ensure params.id exists and has elements
        if (!params.id || params.id.length === 0) {
            return NextResponse.json({ message: "Course ID not provided" }, { status: 400 });
        }

        const userId = user.uid;
        const id = params.id[0];

        // Pass the auth token to Convex
        await convex.mutation(api.course.enrollToCourse, { userId, id });

        return NextResponse.json({
            message: "Successfully enrolled in course",
            userId,
            courseId: id
        });
    } catch (error: any) {
        console.error('Error in course enrollment:', error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}