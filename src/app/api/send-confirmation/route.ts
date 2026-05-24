import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendEmail, buildConfirmationEmail } from "@/lib/mailjet";

export async function POST(req: NextRequest) {
  try {
    // Verify Firebase ID token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let uid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch user profile
    const userDoc = await adminDb.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = userDoc.data()!;

    if (data.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Payment not confirmed" },
        { status: 400 }
      );
    }

    const emailMessage = buildConfirmationEmail({
      name: data.name,
      email: data.email,
      college: data.college,
      whatsappChannel:
        process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL ||
        "https://whatsapp.com/channel/0029VasVFieD38CY1kpxL001",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me",
    });

    const sent = await sendEmail(emailMessage);

    return NextResponse.json({ sent });
  } catch (err) {
    console.error("send-confirmation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
