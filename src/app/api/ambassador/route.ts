import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { generateReferralCode } from "@/lib/referral";
import { FieldValue } from "firebase-admin/firestore";

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

    // Check if ambassador already exists
    const existing = await adminDb.doc(`ambassadors/${uid}`).get();
    if (existing.exists) {
      const data = existing.data();
      return NextResponse.json({
        exists: true,
        referralCode: data?.referralCode,
      });
    }

    const referralCode = generateReferralCode(name);

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

    return NextResponse.json({ success: true, referralCode });
  } catch (err) {
    console.error("ambassador route error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
