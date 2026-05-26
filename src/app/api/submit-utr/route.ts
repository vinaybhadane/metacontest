import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Basic UTR format: 10–22 uppercase alphanumeric characters
const UTR_REGEX = /^[A-Z0-9]{10,22}$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Firebase ID token
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

    // 2. Parse + validate UTR
    let body: { utr?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const utr = (body.utr || "").trim().toUpperCase();

    if (!utr) {
      return NextResponse.json({ error: "UTR number is required." }, { status: 400 });
    }

    if (!UTR_REGEX.test(utr)) {
      return NextResponse.json(
        { error: "Invalid UTR format. Must be 10–22 alphanumeric characters." },
        { status: 400 }
      );
    }

    // 3. Check user profile exists and payment is still pending
    const userDoc = await adminDb.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "Profile not found. Please complete registration form first." },
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;

    if (userData.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "You are already registered and payment confirmed." },
        { status: 400 }
      );
    }

    if (userData.paymentStatus === "utr_submitted") {
      return NextResponse.json(
        { error: "UTR already submitted and under review. Please wait for verification." },
        { status: 400 }
      );
    }

    // Allow: pending_payment, rejected (user can re-submit after rejection)
    const existingUTR = await adminDb
      .collection("users")
      .where("utr", "==", utr)
      .limit(1)
      .get();

    if (!existingUTR.empty) {
      return NextResponse.json(
        { error: "This UTR has already been submitted by another user. Please contact support if this is an error." },
        { status: 409 }
      );
    }

    // 5. Save UTR to Firestore
    await adminDb.doc(`users/${uid}`).update({
      paymentStatus: "utr_submitted",
      utr,
      utrSubmittedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("submit-utr error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
