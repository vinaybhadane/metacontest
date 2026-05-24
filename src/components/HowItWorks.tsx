"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    emoji: "📝",
    title: "Register",
    desc: "Pay the ₹50 entry fee and complete your registration. Quick and simple.",
    color: "var(--color-brand-blue)",
    bg: "var(--color-brand-light)",
  },
  {
    number: "02",
    emoji: "📚",
    title: "Prepare",
    desc: "Study GK, Technology, Aptitude & Current Affairs. Stay updated on our WhatsApp channel.",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    number: "03",
    emoji: "💻",
    title: "Appear",
    desc: "Take the online proctored exam on June 6, 2026, from the comfort of your home.",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    number: "04",
    emoji: "🏆",
    title: "Win",
    desc: "Top 3 winners get cash prizes. Everyone gets a participation certificate!",
    color: "#d97706",
    bg: "#fef3c7",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section
      className="py-20 md:py-28"
      style={{ background: "var(--color-neutral-100)" }}
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
            How It Works
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-neutral-900)",
            }}
          >
            Four Simple Steps
          </h2>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--color-neutral-700)" }}
          >
            From registration to winning — here&apos;s how the journey looks.
          </p>
        </motion.div>

        {/* Steps — desktop horizontal timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="hidden md:grid grid-cols-4 gap-6 relative"
        >
          {/* Connector line */}
          <div
            className="absolute top-14 left-[12.5%] right-[12.5%] h-0.5"
            style={{
              background:
                "linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-hover))",
              zIndex: 0,
            }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Step circle */}
              <div
                className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-md mb-5 border-4"
                style={{
                  background: "#ffffff",
                  borderColor: step.bg,
                }}
              >
                <span className="text-3xl">{step.emoji}</span>
                <span
                  className="text-xs font-bold mt-1"
                  style={{ color: step.color }}
                >
                  {step.number}
                </span>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--color-neutral-900)" }}
              >
                {step.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-neutral-700)" }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Steps — mobile vertical */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-col gap-4 md:hidden"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border shadow-sm"
              style={{ borderColor: "var(--color-neutral-200)" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: step.bg }}
              >
                <span className="text-2xl">{step.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold"
                    style={{ color: step.color }}
                  >
                    STEP {step.number}
                  </span>
                </div>
                <h3
                  className="font-bold text-base mb-1"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
