import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import {
  buildAmbassadorApprovalEmail,
  buildAmbassadorRejectionEmail,
  sendEmail,
} from "@/lib/mailjet";
import { generateReferralCode } from "@/lib/referral";
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

    // 4. Fetch ambassador doc
    const ambDoc = await adminDb.doc(`ambassadors/${uid}`).get();
    if (!ambDoc.exists) {
      return NextResponse.json({ error: "Ambassador not found" }, { status: 404 });
    }

    const ambData = ambDoc.data()!;

    if (ambData.status !== "pending") {
      return NextResponse.json(
        { error: `Cannot ${action}: ambassador status is "${ambData.status}"` },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";

    if (action === "approve") {
      // Generate referral code on approval
      const referralCode = generateReferralCode(ambData.name);
      const referralLink = `${appUrl}/register?ref=${referralCode}`;

      await adminDb.doc(`ambassadors/${uid}`).update({
        status: "active",
        referralCode,
        approvedAt: FieldValue.serverTimestamp(),
        approvedBy: ADMIN_EMAIL,
      });

      // Send approval email with referral code
      const emailMsg = buildAmbassadorApprovalEmail({
        name: ambData.name,
        email: ambData.email,
        referralCode,
        referralLink,
        whatsappGroup:
          process.env.NEXT_PUBLIC_WHATSAPP_AMBASSADOR_GROUP ||
          "https://wa.me/",
        appUrl,
      });
      await sendEmail(emailMsg);

      return NextResponse.json({ success: true, action: "approved", referralCode });
    } else {
      // action === "reject"
      await adminDb.doc(`ambassadors/${uid}`).update({
        status: "rejected",
        rejectedAt: FieldValue.serverTimestamp(),
        rejectedBy: ADMIN_EMAIL,
      });

      // Send rejection email
      const emailMsg = buildAmbassadorRejectionEmail({
        name: ambData.name,
        email: ambData.email,
        appUrl,
      });
      await sendEmail(emailMsg);

      return NextResponse.json({ success: true, action: "rejected" });
    }
  } catch (err) {
    console.error("admin/approve-ambassador error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
