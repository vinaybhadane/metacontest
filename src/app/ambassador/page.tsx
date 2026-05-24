"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Link2,
  MessageCircle,
  Users,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import AmbassadorForm from "@/components/AmbassadorForm";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatNameForLeaderboard } from "@/lib/referral";
import { useAuth } from "@/hooks/useAuth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";

interface Ambassador {
  id: string;
  name: string;
  college: string;
  referralCount: number;
}

const rankEmoji = ["🥇", "🥈", "🥉"];

const benefits = [
  {
    icon: Trophy,
    color: "#d97706",
    bg: "#fef3c7",
    title: "Win Cash Prizes",
    desc: "Top 3 referrers win ₹5,000 / ₹3,000 / ₹2,000",
  },
  {
    icon: Award,
    color: "#0064e0",
    bg: "#e7f0ff",
    title: "Ambassador Certificate",
    desc: "Official certificate recognizing your contribution",
  },
  {
    icon: MessageCircle,
    color: "#25D366",
    bg: "#f0fdf4",
    title: "Exclusive WhatsApp Group",
    desc: "Connect with ambassadors and get early updates",
  },
  {
    icon: Link2,
    color: "#7c3aed",
    bg: "#ede9fe",
    title: "Personal Referral Link",
    desc: "Track signups with your unique referral link",
  },
];

const SEED_REFERRERS: Ambassador[] = [
  { id: "seed-1", name: "Arjun Sharma", college: "IIT Delhi", referralCount: 98 },
  { id: "seed-2", name: "Ananya Iyer", college: "BITS Pilani", referralCount: 92 },
  { id: "seed-3", name: "Ishaan Malhotra", college: "DTU Delhi", referralCount: 85 },
  { id: "seed-4", name: "Priyanka Deshmukh", college: "COEP Pune", referralCount: 84 },
  { id: "seed-5", name: "Rohan Chatterjee", college: "Jadavpur University", referralCount: 75 },
  { id: "seed-6", name: "Meera Nair", college: "NIT Trichy", referralCount: 75 },
  { id: "seed-7", name: "Aditya Patel", college: "LD College of Engineering", referralCount: 72 },
  { id: "seed-8", name: "Saanvi Reddy", college: "IIIT Hyderabad", referralCount: 70 },
  { id: "seed-9", name: "Mahip Singh", college: "PEC Chandigarh", referralCount: 68 },
  { id: "seed-10", name: "Diya Joshi", college: "MSU Baroda", referralCount: 66 },
];

export default function AmbassadorPage() {
  const [leaderboard, setLeaderboard] = useState<Ambassador[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [ambassadorProfile, setAmbassadorProfile] = useState<any | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch a larger list of real ambassadors to check if anyone has crossed the thresholds
    const q = query(
      collection(db, "ambassadors"),
      orderBy("referralCount", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const realAmbassadors = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name,
        college: d.data().college,
        referralCount: d.data().referralCount || 0,
      }));

      // Merge seed referrers and real ambassadors
      const merged = [...SEED_REFERRERS];

      realAmbassadors.forEach((real) => {
        if (real.referralCount > 0) {
          const index = merged.findIndex((m) => m.id === real.id);
          if (index !== -1) {
            merged[index] = real;
          } else {
            merged.push(real);
          }
        }
      });

      // Sort descending by referralCount
      merged.sort((a, b) => b.referralCount - a.referralCount);

      // Slice to keep only the top 10
      setLeaderboard(merged.slice(0, 10));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setAmbassadorProfile(null);
      setProfileLoading(false);
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
        setProfileLoading(false);
      },
      (err) => {
        console.error("Error fetching ambassador status:", err);
        setProfileLoading(false);
      }
    );

    return unsubscribe;
  }, [user, authLoading]);

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

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section
          className="py-20 md:py-28 relative overflow-hidden"
          style={{ background: "var(--color-brand-blue)" }}
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-5xl mb-6">🎓</div>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white mb-6"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Become a META Contest Campus Ambassador
              </h1>
              <p className="text-xl text-white opacity-85 max-w-2xl mx-auto mb-8">
                Represent your college, build your network, and{" "}
                <strong>WIN ₹5,000</strong>
              </p>
              <a
                href="#apply"
                className="inline-block font-bold text-base px-8 py-4 rounded-full transition-all hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: "#ffffff",
                  color: "var(--color-brand-blue)",
                }}
              >
                Apply Now — It&apos;s Free!
              </a>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-24" style={{ background: "#ffffff" }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl sm:text-4xl font-normal"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-neutral-900)",
                }}
              >
                Ambassador Benefits
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {benefits.map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl border text-center hover:shadow-md transition-all"
                    style={{
                      background: "#ffffff",
                      borderColor: "var(--color-neutral-200)",
                    }}
                    whileHover={{ y: -4 }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: b.bg }}
                    >
                      <Icon size={22} style={{ color: b.color }} />
                    </div>
                    <h3
                      className="font-bold text-sm mb-2"
                      style={{ color: "var(--color-neutral-900)" }}
                    >
                      {b.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      {b.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leaderboard + Form side by side */}
        <section
          id="apply"
          className="py-16 md:py-24"
          style={{ background: "var(--color-neutral-100)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Leaderboard */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "#fef3c7" }}
                  >
                    <Trophy size={20} style={{ color: "#d97706" }} />
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-neutral-900)",
                    }}
                  >
                    Leaderboard
                  </h2>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      background: "#d1fae5",
                      color: "#16a34a",
                    }}
                  >
                    🔴 LIVE
                  </span>
                </div>

                {leaderboard.length === 0 ? (
                  <div
                    className="bg-white rounded-2xl border p-8 text-center"
                    style={{ borderColor: "var(--color-neutral-200)" }}
                  >
                    <Users
                      size={40}
                      className="mx-auto mb-3 opacity-30"
                      style={{ color: "var(--color-neutral-500)" }}
                    />
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      No ambassadors yet. Be the first to apply!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((amb, i) => (
                      <motion.div
                        key={amb.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl border flex items-center gap-4 p-4"
                        style={{
                          borderColor:
                            i < 3
                              ? "var(--color-brand-blue)"
                              : "var(--color-neutral-200)",
                          background:
                            i === 0 ? "var(--color-brand-light)" : "#ffffff",
                        }}
                      >
                        <div className="text-2xl w-8 text-center flex-shrink-0">
                          {i < 3 ? rankEmoji[i] : `${i + 1}`}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-semibold text-sm truncate"
                            style={{ color: "var(--color-neutral-900)" }}
                          >
                            {formatNameForLeaderboard(amb.name)}
                          </p>
                        </div>
                        <div
                          className="text-right flex-shrink-0"
                        >
                          <div
                            className="font-bold text-lg"
                            style={{ color: "var(--color-brand-blue)" }}
                          >
                            {amb.referralCount}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--color-neutral-500)" }}
                          >
                            referrals
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <Link
                  href="/register"
                  className="mt-6 flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
                  style={{
                    borderColor: "var(--color-brand-blue)",
                    color: "var(--color-brand-blue)",
                  }}
                >
                  Register as Participant →
                </Link>
              </div>

              {/* Application Form or Ambassador Details */}
              <div
                className="bg-white rounded-3xl border p-8 shadow-sm"
                style={{ borderColor: "var(--color-neutral-200)" }}
              >
                {authLoading || (user && profileLoading) ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-[var(--color-brand-blue)]" size={32} />
                  </div>
                ) : ambassadorProfile ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "var(--color-brand-light)", border: "1px solid var(--color-brand-blue)" }}>
                      <Award className="shrink-0 mt-0.5" size={24} style={{ color: "var(--color-brand-blue)" }} />
                      <div>
                        <p className="font-bold text-base" style={{ color: "var(--color-brand-blue)" }}>Hi Ambassador {ambassadorProfile.name}! 👋</p>
                        <p className="text-xs mt-1" style={{ color: "var(--color-neutral-600)" }}>
                          You are registered as a META Contest Campus Ambassador for <strong>{ambassadorProfile.college}</strong>.
                        </p>
                      </div>
                    </div>

                    {/* Referral code */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: "var(--color-neutral-500)" }}
                      >
                        Your Referral Code
                      </label>
                      <div
                        className="flex items-center gap-2 rounded-xl border p-3"
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
                    </div>

                    {/* Referral link */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: "var(--color-neutral-500)" }}
                      >
                        Shareable Link
                      </label>
                      <div
                        className="flex items-center gap-2 rounded-xl border p-3"
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
                    </div>

                    {/* WhatsApp share */}
                    <a
                      href={`https://wa.me/?text=${whatsappShareText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: "#25D366" }}
                    >
                      <MessageCircle size={18} fill="currentColor" />
                      Share on WhatsApp
                    </a>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div
                        className="flex-1 rounded-xl p-4 text-center border"
                        style={{ background: "var(--color-neutral-500)08", borderColor: "var(--color-neutral-200)" }}
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

                    <Link
                      href="/dashboard"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:bg-neutral-50"
                      style={{
                        borderColor: "var(--color-brand-blue)",
                        color: "var(--color-brand-blue)",
                      }}
                    >
                      Go to My Dashboard →
                    </Link>
                  </div>
                ) : !user ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="text-4xl">🔐</div>
                    <h2
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-neutral-900)",
                      }}
                    >
                      Authentication Required
                    </h2>
                    <p
                      className="text-sm max-w-sm mx-auto mb-6"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      Please sign in with Google to apply for the META Contest Campus Ambassador program.
                    </p>
                    <GoogleAuthButton onSuccess={() => {}} />
                  </div>
                ) : (
                  <>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-neutral-900)",
                      }}
                    >
                      Apply as Ambassador
                    </h2>
                    <p
                      className="text-sm mb-6"
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      Free to join. Earn through referrals only.
                    </p>
                    <AmbassadorForm />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
