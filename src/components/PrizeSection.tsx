"use client";

import { motion } from "framer-motion";
import { Trophy, Users, Star } from "lucide-react";

const prizes = [
  {
    place: 2,
    medal: "🥈",
    amount: "₹3,000",
    label: "2nd Place",
    heightClass: "pt-8",
    podiumHeight: "h-28",
    gradient: "prize-silver",
    delay: 0.1,
    bg: "linear-gradient(135deg, #94a3b8, #cbd5e1)",
  },
  {
    place: 1,
    medal: "🥇",
    amount: "₹5,000",
    label: "1st Place",
    heightClass: "pt-0",
    podiumHeight: "h-36",
    gradient: "prize-gold",
    delay: 0,
    bg: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    isFirst: true,
  },
  {
    place: 3,
    medal: "🥉",
    amount: "₹2,000",
    label: "3rd Place",
    heightClass: "pt-12",
    podiumHeight: "h-20",
    gradient: "prize-bronze",
    delay: 0.2,
    bg: "linear-gradient(135deg, #b45309, #d97706)",
  },
];

export default function PrizeSection() {
  return (
    <section
      id="prizes"
      className="py-20 md:py-28"
      style={{ background: "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
            style={{
              color: "var(--color-brand-blue)",
              background: "var(--color-brand-light)",
            }}
          >
            Prizes
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-neutral-900)",
            }}
          >
            Win Big. Earn Glory.
          </h2>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--color-neutral-700)" }}
          >
            Total prize pool of{" "}
            <strong style={{ color: "var(--color-brand-blue)" }}>
              ₹10,000
            </strong>{" "}
            up for grabs!
          </p>
        </motion.div>

        {/* Podium — Desktop */}
        <div className="hidden md:flex items-end justify-center gap-6 mb-14">
          {prizes.map((prize) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: prize.delay }}
              className={`flex flex-col items-center ${prize.heightClass}`}
            >
              {/* Card */}
              <div
                className="relative w-48 rounded-2xl p-6 text-center shadow-lg mb-0 border"
                style={{
                  background: prize.isFirst ? "var(--color-brand-light)" : "#f8fafc",
                  borderColor: prize.isFirst
                    ? "var(--color-brand-blue)"
                    : "var(--color-neutral-200)",
                  transform: prize.isFirst ? "scale(1.05)" : "scale(1)",
                }}
              >
                {prize.isFirst && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "var(--color-brand-blue)" }}
                  >
                    🏆 WINNER
                  </div>
                )}
                <div className="text-4xl mb-3">{prize.medal}</div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {prize.amount}
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  {prize.label}
                </div>
              </div>

              {/* Podium base */}
              <div
                className={`w-48 ${prize.podiumHeight} rounded-b-none flex items-center justify-center`}
                style={{ background: prize.bg, borderRadius: "0 0 12px 12px" }}
              >
                <span className="text-white font-bold text-2xl">{prize.place}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile stacked cards */}
        <div className="flex flex-col gap-4 md:hidden mb-10">
          {[prizes[1], prizes[0], prizes[2]].map((prize) => (
            <motion.div
              key={`mobile-${prize.place}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: prize.delay }}
              className="flex items-center gap-4 p-5 rounded-2xl border"
              style={{
                background: prize.isFirst ? "var(--color-brand-light)" : "#ffffff",
                borderColor: prize.isFirst
                  ? "var(--color-brand-blue)"
                  : "var(--color-neutral-200)",
              }}
            >
              <div className="text-4xl">{prize.medal}</div>
              <div className="flex-1">
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  {prize.label}
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {prize.amount}
                </div>
              </div>
              {prize.isFirst && (
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--color-brand-blue)" }}
                >
                  TOP PRIZE
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Total pool + Ambassador prizes */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-6 text-center border"
            style={{
              background: "var(--color-brand-light)",
              borderColor: "var(--color-brand-blue)",
            }}
          >
            <Trophy
              className="mx-auto mb-3"
              size={28}
              style={{ color: "var(--color-brand-blue)" }}
            />
            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "var(--color-brand-blue)" }}
            >
              ₹10,000
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: "var(--color-neutral-700)" }}
            >
              Total Prize Pool
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-6 text-center border"
            style={{
              background: "#f0fdf4",
              borderColor: "#86efac",
            }}
          >
            <Users
              className="mx-auto mb-3"
              size={28}
              style={{ color: "#16a34a" }}
            />
            <div
              className="text-lg font-bold mb-1"
              style={{ color: "#16a34a" }}
            >
              Ambassador Prizes
            </div>
            <div
              className="text-sm"
              style={{ color: "var(--color-neutral-700)" }}
            >
              Top 3 Campus Ambassadors also win{" "}
              <strong>₹5,000 / ₹3,000 / ₹2,000</strong>
            </div>
          </motion.div>
        </div>

        {/* Certificate callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border"
            style={{
              background: "#fffbeb",
              borderColor: "#fbbf24",
            }}
          >
            <Star size={16} style={{ color: "#d97706" }} />
            <span
              className="text-sm font-semibold"
              style={{ color: "#92400e" }}
            >
              📜 All participants receive a Participation Certificate!
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
