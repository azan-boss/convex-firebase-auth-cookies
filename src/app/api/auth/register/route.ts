import { NextResponse } from "next/server";
import { auth } from "@/convex/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        console.log("Registration endpoint hit");
        console.log("Received registration request for email:", email);

        // Input validation
        if (!email || !password) {
            return NextResponse.json(
                { message: "Error", error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Error", error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Error", error: "Invalid email format" },
                { status: 400 }
            );
        }

        console.log("Attempting to create user with Firebase");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get the ID token
        const idToken = await user.getIdToken();

        // Create user profile using server-side client
        await convex.mutation(api.profile.createProfile, { 
            id: user.uid, 
            email: user.email || '', 
            role: "student"
        });

        const response = NextResponse.json({
            message: "You are successfully registered and your profile has been created",
            user: {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified
                ,idToken:idToken
            }
        }, { status: 201 });

        // Set the token as an HTTP-only cookie
        response.cookies.set({
            name: 'auth-token',
            value: idToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;

    } catch (error: any) {
        // Handle specific Firebase Auth errors
        const errorCode = error?.code;
        let errorMessage = "An unexpected error occurred";
        let statusCode = 500;

        switch (errorCode) {
            case 'auth/email-already-in-use':
                errorMessage = "This email is already registered";
                statusCode = 409;
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email format";
                statusCode = 400;
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Email/password registration is not enabled";
                statusCode = 403;
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak";
                statusCode = 400;
                break;
        }

        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Error", error: errorMessage },
            { status: statusCode }
        );
    }
}