"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import {
  Copy,
  Check,
  MessageCircle,
  Calendar,
  Award,
  Users,
  LogOut,
  Loader2,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "https://wa.me/";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";

interface UserProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  referralCode: string;
  referralCount?: number;
  paymentStatus: string;
  registeredAt?: { seconds: number };
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [ambassadorProfile, setAmbassadorProfile] = useState<any | null>(null);
  const [ambassadorLoading, setAmbassadorLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/register");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
      setProfileLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) {
      setAmbassadorLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "ambassadors", user.uid),
      (snap) => {
        if (snap.exists()) {
          setAmbassadorProfile(snap.data());
        } else {
          setAmbassadorProfile(null);
        }
        setAmbassadorLoading(false);
      },
      (error) => {
        console.error("Error fetching ambassador status:", error);
        setAmbassadorLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const referralCode = ambassadorProfile?.referralCode || "";
  const referralLink = referralCode ? `${APP_URL}/register?ref=${referralCode}` : "";
  const whatsappShareText = encodeURIComponent(
    `🎯 I just registered for META Contest 2026! Join me — India's biggest open online quiz. Win ₹5,000! Use my referral code ${referralCode} to register: ${referralLink}`
  );

  const copyCode = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    document.cookie = "mc_session=; path=/; max-age=0";
    router.push("/");
  };

  if (loading || profileLoading || ambassadorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          size={36}
          className="animate-spin"
          style={{ color: "var(--color-brand-blue)" }}
        />
      </div>
    );
  }

  if (!user || !profile) return null;

  const cardClass =
    "bg-white rounded-2xl border p-6 shadow-sm";
  const cardStyle = { borderColor: "var(--color-neutral-200)" };

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-neutral-100)" }}
    >
      {/* Top bar */}
      <header
        className="bg-white border-b sticky top-0 z-10"
        style={{ borderColor: "var(--color-neutral-200)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/metalogo.png"
              alt="META Contest Logo"
              className="w-7 h-7 object-contain"
            />
            <div className="flex items-center gap-0.5">
              <span
                className="text-lg font-bold"
                style={{ color: "var(--color-brand-blue)" }}
              >
                META
              </span>
              <span
                className="text-lg font-semibold"
                style={{ color: "var(--color-neutral-900)" }}
              >
                Contest
              </span>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            id="signout-btn"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-red-50"
            style={{ color: "#dc2626" }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-5">
        {/* Welcome card */}
        <div
          className={`${cardClass} flex flex-col sm:flex-row items-start sm:items-center gap-4`}
          style={cardStyle}
        >
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || "Profile"}
              width={56}
              height={56}
              className="rounded-full border-2"
              style={{ borderColor: "var(--color-brand-light)" }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl font-bold truncate"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-neutral-900)",
              }}
            >
              Welcome back, {profile.name.split(" ")[0]}! 👋
            </h1>
            <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
              {profile.college} · {profile.degree}
            </p>
          </div>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shrink-0"
            style={{ background: "#d1fae5", color: "#16a34a" }}
          >
            <Check size={14} />
            Registration Confirmed ✅
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Exam Details */}
          <div className={cardClass} style={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-brand-light)" }}
              >
                <Calendar size={20} style={{ color: "var(--color-brand-blue)" }} />
              </div>
              <h2 className="font-bold" style={{ color: "var(--color-neutral-900)" }}>
                Exam Details
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { label: "Date", value: "June 6, 2026" },
                { label: "Mode", value: "Online Proctored" },
                { label: "Time", value: "1:00 PM (IST)" },
                { label: "Questions", value: "50 MCQs" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span style={{ color: "var(--color-neutral-500)" }}>
                    {item.label}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--color-neutral-900)" }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate */}
          <div className={cardClass} style={cardStyle}>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "#fef3c7" }}
              >
                <Award size={20} style={{ color: "#d97706" }} />
              </div>
              <h2 className="font-bold" style={{ color: "var(--color-neutral-900)" }}>
                Your Certificate
              </h2>
            </div>
            <div
              className="rounded-xl p-4 text-center"
              style={{ background: "var(--color-neutral-100)" }}
            >
              <div className="text-3xl mb-2">📜</div>
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: "var(--color-neutral-700)" }}
              >
                Participation Certificate
              </p>
              <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                Available after June 6, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Referral Section (Ambassadors only) */}
        {ambassadorProfile && (
          <div className={cardClass} style={cardStyle}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-brand-light)" }}
              >
                <Users size={20} style={{ color: "var(--color-brand-blue)" }} />
              </div>
              <div>
                <h2
                  className="font-bold"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  Your Referrals
                </h2>
                <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                  Share your code and track how many friends you&apos;ve brought in.
                </p>
              </div>
            </div>

            {/* Referral stats */}
            <div className="flex gap-4 mb-5">
              <div
                className="flex-1 rounded-xl p-4 text-center"
                style={{ background: "var(--color-brand-light)" }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-brand-blue)" }}
                >
                  {ambassadorProfile.referralCount || 0}
                </div>
                <div
                  className="text-xs font-medium mt-1"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Successful Referrals
                </div>
              </div>
            </div>

            {/* Referral code */}
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--color-neutral-500)" }}
            >
              Your Referral Code
            </label>
            <div
              className="flex items-center gap-2 rounded-xl border p-3 mb-4"
              style={{
                background: "var(--color-neutral-100)",
                borderColor: "var(--color-neutral-200)",
              }}
            >
              <span
                className="flex-1 font-mono font-bold text-lg tracking-widest"
                style={{ color: "var(--color-brand-blue)" }}
              >
                {referralCode}
              </span>
              <button
                id="copy-referral-btn"
                onClick={copyCode}
                className="p-2 rounded-lg transition-all copy-btn"
                style={{
                  background: copied ? "#d1fae5" : "var(--color-brand-light)",
                  color: copied ? "#16a34a" : "var(--color-brand-blue)",
                }}
                aria-label="Copy referral code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* Referral link */}
            <label
              className="block text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--color-neutral-500)" }}
            >
              Shareable Link
            </label>
            <div
              className="flex items-center gap-2 rounded-xl border p-3 mb-5"
              style={{
                background: "var(--color-neutral-100)",
                borderColor: "var(--color-neutral-200)",
              }}
            >
              <span
                className="flex-1 text-xs truncate"
                style={{ color: "var(--color-neutral-700)" }}
              >
                {referralLink}
              </span>
              <a
                href={referralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg"
                style={{
                  background: "var(--color-brand-light)",
                  color: "var(--color-brand-blue)",
                }}
              >
                <ExternalLink size={14} />
              </a>
            </div>

            {/* WhatsApp share */}
            <a
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              id="whatsapp-share-btn"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#25D366" }}
            >
              <MessageCircle size={18} fill="currentColor" />
              Share on WhatsApp
            </a>
          </div>
        )}

        {/* Campus Ambassador CTA (Non-ambassadors only) */}
        {!ambassadorProfile && (
          <div
            className={`${cardClass} flex flex-col sm:flex-row items-center gap-4`}
            style={{ ...cardStyle, background: "var(--color-brand-light)", borderColor: "var(--color-brand-blue)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "var(--color-brand-blue)" }}
            >
              <GraduationCap size={24} style={{ color: "#ffffff" }} />
            </div>
            <div className="flex-1">
              <p className="font-bold mb-0.5" style={{ color: "var(--color-brand-blue)" }}>
                🎓 Apply for Campus Ambassador
              </p>
              <p className="text-sm" style={{ color: "var(--color-neutral-600)" }}>
                Represent your college, earn rewards, and get an official certificate.
              </p>
            </div>
            <Link
              href="/ambassador"
              id="ambassador-apply-btn"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shrink-0 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "var(--color-brand-blue)" }}
            >
              Apply Now
            </Link>
          </div>
        )}

        {/* WhatsApp channel CTA */}
        <div
          className={`${cardClass} flex flex-col sm:flex-row items-center gap-4`}
          style={cardStyle}
        >
          <div className="flex-1">
            <p className="font-bold mb-1" style={{ color: "var(--color-neutral-900)" }}>
              📲 Join the WhatsApp Channel
            </p>
            <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
              Get all the important notification and updates directly.
            </p>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            id="dashboard-whatsapp-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white shrink-0"
            style={{ background: "#25D366" }}
          >
            <MessageCircle size={16} fill="currentColor" />
            Join Now
          </a>
        </div>
      </main>
    </div>
  );
}
