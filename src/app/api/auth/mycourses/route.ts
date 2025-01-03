import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
export async function GET(request: NextRequest) {
    const currentUser    = await getAuth().verifyIdToken(request.cookies.get("auth-token")?.value || '');
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
        const profile = await convex.query(api.profile.myProfile, { email: currentUser.email||"" });
        console.log(profile?.courses);
        

    
    return NextResponse.json({ message: "Hello, world!" ,userInfo:currentUser,profile
     });
}