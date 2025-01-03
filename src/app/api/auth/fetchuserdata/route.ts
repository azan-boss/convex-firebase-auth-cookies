import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import '../../../../lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        // Extract the auth-token cookie from the request
        const token = request.cookies.get("auth-token")?.value;
        console.log("the token .................................",token);
        
        if (!token) {
            throw new Error("Missing auth-token cookie");
        }

        // Verify the token using Firebase Admin SDK
        const decodedToken = await getAuth().verifyIdToken(token);

        // Extract user information from the verified token
        const userEmail = decodedToken.email;
        const userId = decodedToken.uid;

        // Fetch user profile or perform actions
        const userProfile = { email: userEmail, id: userId, role: "student" };

        return NextResponse.json({ profile: userProfile });
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}


