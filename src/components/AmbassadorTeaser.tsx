"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Award, MessageCircle, Link2 } from "lucide-react";

const benefits = [
  { icon: Award, text: "Top 3 referrers win ₹5,000 / ₹3,000 / ₹2,000" },
  { icon: Award, text: "Ambassador Certificate" },
  { icon: MessageCircle, text: "Exclusive Ambassador WhatsApp group" },
  { icon: Link2, text: "Personal referral link to track signups" },
];

export default function AmbassadorTeaser() {
  return (
    <section className="py-20 md:py-28" style={{ background: "#ffffff" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl text-white p-8 md:p-12 lg:p-16"
          style={{
            background:
              "linear-gradient(135deg, #0047b3 0%, #0064e0 40%, #1877f2 100%)",
          }}
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{ background: "#ffffff" }}
          />
          <div
            className="absolute -bottom-20 -left-12 w-80 h-80 rounded-full opacity-10"
            style={{ background: "#ffffff" }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
            {/* Left content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <Users size={24} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">
                  Campus Ambassador Program
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-normal mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Become a META Contest Campus Ambassador
              </h2>

              <p className="text-lg opacity-85 mb-8 max-w-xl">
                Represent your college, build your network, and{" "}
                <strong>WIN ₹5,000</strong>! Refer your college mates and climb
                the leaderboard.
              </p>

              {/* Benefits */}
              <ul className="space-y-3 mb-8">
                {benefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <li key={i} className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.2)" }}
                      >
                        <Icon size={14} />
                      </div>
                      <span className="text-sm font-medium opacity-90">
                        {b.text}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/ambassador"
                id="ambassador-teaser-cta"
                className="inline-flex items-center gap-2 font-bold text-base px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: "#ffffff",
                  color: "var(--color-brand-blue)",
                }}
              >
                Apply as Ambassador
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Right — floating stats card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="lg:w-64 p-6 rounded-2xl text-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <div className="text-5xl mb-3">🏆</div>
              <div className="text-3xl font-bold mb-1">₹10,000</div>
              <div className="text-sm opacity-80 mb-4">Ambassador Prize Pool</div>
              <div
                className="rounded-xl p-3 space-y-2"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <div className="text-sm">🥇 1st Referrer: ₹5,000</div>
                <div className="text-sm">🥈 2nd Referrer: ₹3,000</div>
                <div className="text-sm">🥉 3rd Referrer: ₹2,000</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
