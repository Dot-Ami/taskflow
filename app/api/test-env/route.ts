import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        // Don't log actual values for security!
        clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
        secretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        nextAuthSecretLength: process.env.NEXTAUTH_SECRET?.length || 0,
    });
}
