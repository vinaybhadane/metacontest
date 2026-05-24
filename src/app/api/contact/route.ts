import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendEmail } from "@/lib/mailjet";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all fields" },
        { status: 400 }
      );
    }

    // Get client IP address
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Rate Limit: 2 queries per day per email
    const emailQueries = await adminDb
      .collection("contact_queries")
      .where("email", "==", email.toLowerCase())
      .where("timestamp", ">=", startOfToday)
      .get();

    if (emailQueries.size >= 2) {
      return NextResponse.json(
        { error: "You have reached the limit of 2 queries per day. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Rate Limit: 2 queries per day per IP (anti-abuse)
    const ipQueries = await adminDb
      .collection("contact_queries")
      .where("ip", "==", clientIp)
      .where("timestamp", ">=", startOfToday)
      .get();

    if (ipQueries.size >= 2) {
      return NextResponse.json(
        { error: "Too many queries from this network today. Please try again tomorrow." },
        { status: 429 }
      );
    }

    // Save contact query to Firestore
    const docRef = await adminDb.collection("contact_queries").add({
      name,
      email: email.toLowerCase(),
      subject,
      message,
      ip: clientIp,
      timestamp: FieldValue.serverTimestamp(),
    });

    // Send email notification to Admin (contestmeta@gmail.com) via Mailjet
    const fromEmail = process.env.MAILJET_FROM_EMAIL || "noreply@metacontest.me";
    const fromName = process.env.MAILJET_FROM_NAME || "META Contest Support";
    const adminEmail = process.env.CONTACT_EMAIL_1 || "contestmeta@gmail.com";

    const mailSent = await sendEmail({
      From: { Email: fromEmail, Name: fromName },
      To: [{ Email: adminEmail, Name: "META Contest Admin" }],
      Subject: `🔔 New Contact Form Query: ${subject}`,
      HTMLPart: `
        <h3>New query received from META Contest website</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif;">
          <tr>
            <th align="left" style="background-color: #f2f2f2; width: 30%;">Field</th>
            <th align="left" style="background-color: #f2f2f2;">Value</th>
          </tr>
          <tr>
            <td><strong>Name</strong></td>
            <td>${name}</td>
          </tr>
          <tr>
            <td><strong>Email</strong></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><strong>Subject</strong></td>
            <td>${subject}</td>
          </tr>
          <tr>
            <td><strong>Client IP</strong></td>
            <td>${clientIp}</td>
          </tr>
          <tr>
            <td><strong>Query ID</strong></td>
            <td>${docRef.id}</td>
          </tr>
          <tr>
            <td valign="top"><strong>Message</strong></td>
            <td>${message.replace(/\n/g, "<br/>")}</td>
          </tr>
        </table>
      `,
    });

    if (!mailSent) {
      console.warn("Mailjet failed to deliver admin notification email.");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact api error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
