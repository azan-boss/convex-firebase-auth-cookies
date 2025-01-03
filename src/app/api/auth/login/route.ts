import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/convex/firebase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Input validation
        if (!email || !password) {
            return NextResponse.json(
                { message: "Error", error: "Email and password are required" },
                { status: 400 }
            );
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

         
        const response=NextResponse.json({
            message: "Successfully logged in",
            user: {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                token
            }
        });

        response.cookies.set({
            name: 'auth-token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Error", error: error.message || "Failed to login" },
            { status: 500 }
        );
    }
}