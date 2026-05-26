import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendEmail, buildConfirmationEmail, buildRejectionEmail } from "@/lib/mailjet";
import { FieldValue } from "firebase-admin/firestore";

const ADMIN_EMAIL = "vinaybhadane06@gmail.com";

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Firebase ID token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let callerEmail: string;
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      callerEmail = decoded.email || "";
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 2. Strict admin-only gate
    if (callerEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Parse body
    let body: { uid?: string; action?: "approve" | "reject" };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { uid, action } = body;

    if (!uid || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Missing or invalid uid/action" },
        { status: 400 }
      );
    }

    // 4. Fetch target user
    const userDoc = await adminDb.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data()!;

    if (userData.paymentStatus !== "utr_submitted") {
      return NextResponse.json(
        { error: `Cannot ${action}: payment status is "${userData.paymentStatus}"` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";

    if (action === "approve") {
      // Update Firestore
      await adminDb.doc(`users/${uid}`).update({
        paymentStatus: "paid",
        verifiedAt: FieldValue.serverTimestamp(),
        verifiedBy: ADMIN_EMAIL,
      });

      // Send confirmation email
      const emailMsg = buildConfirmationEmail({
        name: userData.name,
        email: userData.email,
        college: userData.college,
        whatsappChannel:
          process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL ||
          "https://whatsapp.com/channel/0029VasVFieD38CY1kpxL001",
        appUrl,
      });
      await sendEmail(emailMsg);

      // If referred by ambassador, increment count
      if (userData.referredBy) {
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

      return NextResponse.json({ success: true, action: "approved" });
    } else {
      // action === "reject"
      await adminDb.doc(`users/${uid}`).update({
        paymentStatus: "rejected",
        rejectedAt: FieldValue.serverTimestamp(),
        rejectedBy: ADMIN_EMAIL,
        // Clear UTR so user can re-submit
        utr: FieldValue.delete(),
        utrSubmittedAt: FieldValue.delete(),
      });

      // Send rejection email
      const emailMsg = buildRejectionEmail({
        name: userData.name,
        email: userData.email,
        utr: userData.utr || "N/A",
        appUrl,
      });
      await sendEmail(emailMsg);

      return NextResponse.json({ success: true, action: "rejected" });
    }
  } catch (err) {
    console.error("admin/approve-payment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
