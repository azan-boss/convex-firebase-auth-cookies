import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initFirebaseAdmin as initFirebaseAdminFunc } from "@/lib/firebase-admin"
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export async function GET(request: NextRequest) {
    try {
        // Initialize Firebase Admin
        initFirebaseAdminFunc();
        
        // Extract the auth header from the request
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Invalid authorization header" }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        
        // Verify the token using Firebase Admin SDK
        const decodedToken = await getAuth().verifyIdToken(token);
        console.log(decodedToken.email);
        

        // Extract user information from the verified token
        const userEmail = decodedToken.email;
        if (!userEmail) {
            return NextResponse.json({ error: "No email found in token" }, { status: 400 });
        }

        // Fetch user profile from Convex
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        const profile = await convex.query(api.profile.myProfile, { email: userEmail });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({ profile });
    } catch (error: any) {
        console.error("Profile route error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: error.status || 500 }
        );
    }
}
