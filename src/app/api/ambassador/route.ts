import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { generateReferralCode } from "@/lib/referral";
import { FieldValue } from "firebase-admin/firestore";
import { buildAmbassadorApprovalEmail, sendEmail } from "@/lib/mailjet";

const ambassadorSchema = z.object({
  uid: z.string().min(1),
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().min(3, "College name required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  whyAmbassador: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = ambassadorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { uid, name, college, email, mobile, whyAmbassador } = parsed.data;

    // Secure flow check: user must be successfully registered as a participant with verified payment
    const userDoc = await adminDb.doc(`users/${uid}`).get();
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: "You must first register as a participant in the META Contest." },
        { status: 400 }
      );
    }

    const userData = userDoc.data();
    if (userData?.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Your payment must be verified before you can become a Campus Ambassador." },
        { status: 400 }
      );
    }

    // Check if ambassador already exists
    const existing = await adminDb.doc(`ambassadors/${uid}`).get();
    if (existing.exists) {
      const data = existing.data();
      return NextResponse.json({
        exists: true,
        referralCode: data?.referralCode,
        status: data?.status || "active",
      });
    }

    // Generate referral code immediately
    const referralCode = generateReferralCode(name);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";
    const referralLink = `${appUrl}/register?ref=${referralCode}`;
    const whatsappGroup = process.env.NEXT_PUBLIC_WHATSAPP_AMBASSADOR_GROUP || "https://wa.me/";

    // Save as active — no admin approval needed
    await adminDb.doc(`ambassadors/${uid}`).set({
      uid,
      name,
      college,
      email,
      mobile,
      whyAmbassador: whyAmbassador || "",
      referralCode,
      referralCount: 0,
      referrals: [],
      status: "active",
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send ambassador approval/welcome email immediately
    try {
      const emailMsg = buildAmbassadorApprovalEmail({
        name,
        email,
        referralCode,
        referralLink,
        whatsappGroup,
        appUrl,
      });
      await sendEmail(emailMsg);
    } catch (emailErr) {
      console.error("Failed to send welcome email to ambassador:", emailErr);
      // Do not fail the whole request if email fails, but log it.
    }

    return NextResponse.json({ success: true, status: "active", referralCode });

  } catch (err) {
    console.error("ambassador route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
