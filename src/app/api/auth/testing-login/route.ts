import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (
      email === "testing@metacontest.com" &&
      password === "password@123"
    ) {
      // Create custom token for testing UID
      const customToken = await adminAuth.createCustomToken("testing-uid-123");
      return NextResponse.json({ token: customToken });
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err) {
    console.error("testing-login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
