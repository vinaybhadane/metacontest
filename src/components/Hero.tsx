"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "https://wa.me/";
const EXAM_DATE = new Date("2026-06-06T13:00:00+05:30");

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);

  return timeLeft;
}

const CountdownBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div
      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg"
      style={{ background: "var(--color-brand-blue)" }}
    >
      <span
        className="text-2xl sm:text-3xl font-bold tabular-nums"
        style={{ color: "#ffffff", fontFamily: "var(--font-body)" }}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span
      className="mt-2 text-xs font-medium uppercase tracking-widest"
      style={{ color: "var(--color-neutral-500)" }}
    >
      {label}
    </span>
  </div>
);

const StatBadge = ({
  icon,
  text,
  delay,
}: {
  icon: string;
  text: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4 }}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm border"
    style={{
      background: "#ffffff",
      borderColor: "var(--color-brand-light)",
      color: "var(--color-neutral-700)",
    }}
  >
    <span>{icon}</span>
    <span>{text}</span>
  </motion.div>
);

export default function Hero() {
  const { days, hours, minutes, seconds } = useCountdown(EXAM_DATE);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Dot grid background */}
      <div className="absolute inset-0 hero-pattern pointer-events-none" />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,100,224,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Stat badges */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <StatBadge icon="📝" text="50 Questions" delay={0.1} />
          <StatBadge icon="💰" text="₹10,000 Prize Pool" delay={0.2} />
          <StatBadge icon="📅" text="June 6, 1:00 PM" delay={0.3} />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-tight mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-neutral-900)",
            }}
          >
            India&apos;s Most{" "}
            <span style={{ color: "var(--color-brand-blue)" }}>Open</span>{" "}
            Online Contest
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-10"
            style={{ color: "var(--color-neutral-700)" }}
          >
            Test your knowledge, win big, and represent your college. Open for
            everyone — students, graduates &amp; professionals.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Link
            href="/register"
            id="hero-register-btn"
            className="inline-flex items-center gap-2 text-base font-semibold text-white px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
            style={{ background: "var(--color-brand-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-brand-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--color-brand-blue)")
            }
          >
            Register Now — ₹50
            <ArrowRight size={18} />
          </Link>
          <a
            href="#about"
            id="hero-learn-more-btn"
            className="inline-flex items-center gap-2 text-base font-semibold px-8 py-4 rounded-full border-2 transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: "var(--color-brand-blue)",
              color: "var(--color-brand-blue)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-brand-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Learn More
          </a>
        </motion.div>

        {/* WhatsApp below CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mb-16"
        >
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-all"
            style={{ color: "#25D366" }}
          >
            <MessageCircle size={16} fill="currentColor" />
            Join WhatsApp for exam updates
          </a>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-6"
            style={{ color: "var(--color-neutral-500)" }}
          >
            ⏰ Exam Starts In
          </p>
          <div className="flex items-end gap-4 sm:gap-6">
            <CountdownBox value={days} label="Days" />
            <span
              className="text-3xl font-bold mb-6"
              style={{ color: "var(--color-brand-blue)" }}
            >
              :
            </span>
            <CountdownBox value={hours} label="Hours" />
            <span
              className="text-3xl font-bold mb-6"
              style={{ color: "var(--color-brand-blue)" }}
            >
              :
            </span>
            <CountdownBox value={minutes} label="Minutes" />
            <span
              className="text-3xl font-bold mb-6"
              style={{ color: "var(--color-brand-blue)" }}
            >
              :
            </span>
            <CountdownBox value={seconds} label="Seconds" />
          </div>
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--color-neutral-500)" }}
          >
            June 6, 2026 at 1:00 PM · Online Proctored Exam
          </p>
        </motion.div>
      </div>
    </section>
  );
}
