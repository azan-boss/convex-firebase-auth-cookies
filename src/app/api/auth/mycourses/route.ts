import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";
export async function GET(request: NextRequest) {
    const idToken = await getAuth().verifyIdToken(request.cookies.get("auth-token")?.value || '');
    console.log(idToken.email);
    
    return NextResponse.json({ message: "Hello, world!" ,idToken:idToken });
}