import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { FieldValue } from "firebase-admin/firestore";

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

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    // Verify HMAC signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment signature verification failed" },
        { status: 400 }
      );
    }

    // Fetch user doc to get referredBy
    const userDoc = await adminDb.doc(`users/${uid}`).get();
    const userData = userDoc.data();

    // Update payment status via Admin SDK (bypasses Firestore rules)
    await adminDb.doc(`users/${uid}`).update({
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      registeredAt: FieldValue.serverTimestamp(),
    });

    // If user was referred by an ambassador, increment their count
    if (userData?.referredBy) {
      const ambassadorRef = adminDb.doc(`ambassadors/${userData.referredBy}`);
      const ambassadorDoc = await ambassadorRef.get();

      if (ambassadorDoc.exists) {
        await ambassadorRef.update({
          referralCount: FieldValue.increment(1),
          referrals: FieldValue.arrayUnion({
            uid,
            name: userData.name || "",
            registeredAt: new Date().toISOString(),
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
