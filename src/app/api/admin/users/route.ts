import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "vinaybhadane06@gmail.com";

export async function GET(req: NextRequest) {
  try {
    // Verify Firebase ID token
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

    if (callerEmail !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all users (Admin SDK bypasses Firestore rules)
    const [allUsersSnap, allAmbSnap] = await Promise.all([
      adminDb.collection("users").get(),
      adminDb.collection("ambassadors").get(),
    ]);

    let pending = 0, approved = 0, rejected = 0;
    const pendingUsers: object[] = [];

    allUsersSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.paymentStatus === "utr_submitted") {
        pending++;
        pendingUsers.push({
          uid: doc.id,
          name: d.name || "",
          email: d.email || "",
          college: d.college || "",
          degree: d.degree || "",
          mobile: d.mobile || "",
          utr: d.utr || "",
          utrSubmittedAt: d.utrSubmittedAt?.toDate?.()?.toISOString() || null,
          paymentStatus: d.paymentStatus,
        });
      } else if (d.paymentStatus === "paid") {
        approved++;
      } else if (d.paymentStatus === "rejected") {
        rejected++;
      }
    });

    // Sort pending payments by submission time desc
    pendingUsers.sort((a: any, b: any) => {
      if (!a.utrSubmittedAt) return 1;
      if (!b.utrSubmittedAt) return -1;
      return new Date(b.utrSubmittedAt).getTime() - new Date(a.utrSubmittedAt).getTime();
    });

    // Ambassador stats
    let ambPending = 0, ambApproved = 0, ambRejected = 0;
    const pendingAmbassadors: object[] = [];

    allAmbSnap.docs.forEach((doc) => {
      const d = doc.data();
      if (d.status === "pending") {
        ambPending++;
        pendingAmbassadors.push({
          uid: doc.id,
          name: d.name || "",
          email: d.email || "",
          college: d.college || "",
          mobile: d.mobile || "",
          whyAmbassador: d.whyAmbassador || "",
          createdAt: d.createdAt?.toDate?.()?.toISOString() || null,
          status: d.status,
        });
      } else if (d.status === "active") {
        ambApproved++;
      } else if (d.status === "rejected") {
        ambRejected++;
      }
    });

    // Sort pending ambassadors by createdAt desc
    pendingAmbassadors.sort((a: any, b: any) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      pendingUsers,
      stats: {
        total: allUsersSnap.size,
        pending,
        approved,
        rejected,
      },
      pendingAmbassadors,
      ambStats: {
        total: allAmbSnap.size,
        pending: ambPending,
        approved: ambApproved,
        rejected: ambRejected,
      },
    });

  } catch (err) {
    console.error("admin/users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
