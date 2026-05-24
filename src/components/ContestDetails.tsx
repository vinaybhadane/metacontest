"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  FileText,
  BookOpen,
  Users,
  Award,
  CreditCard,
  Shield,
} from "lucide-react";

const details = [
  {
    icon: Calendar,
    title: "Exam Date",
    value: "June 6, 2026",
    desc: "Online Proctored",
    color: "#0064E0",
    bg: "#e7f0ff",
  },
  {
    icon: FileText,
    title: "Format",
    value: "50 Questions",
    desc: "Multiple Choice (MCQ)",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    icon: BookOpen,
    title: "Subjects",
    value: "4 Topics",
    desc: "GK · Technology · Aptitude · Current Affairs",
    color: "#059669",
    bg: "#d1fae5",
  },
  {
    icon: Users,
    title: "Who Can Participate",
    value: "Everyone",
    desc: "Students, Graduates & Professionals",
    color: "#dc2626",
    bg: "#fee2e2",
  },
  {
    icon: Award,
    title: "Certificate",
    value: "For ALL",
    desc: "Participation Certificate issued after exam",
    color: "#d97706",
    bg: "#fef3c7",
  },
  {
    icon: CreditCard,
    title: "Entry Fee",
    value: "₹50 Only",
    desc: "One-time registration fee",
    color: "#0064E0",
    bg: "#e7f0ff",
  },
  {
    icon: Shield,
    title: "Exam Mode",
    value: "Online Proctored",
    desc: "Secure, monitored exam environment",
    color: "#0f766e",
    bg: "#ccfbf1",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContestDetails() {
  return (
    <section
      id="about"
      className="py-20 md:py-28"
      style={{ background: "var(--color-neutral-100)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4"
            style={{
              color: "var(--color-brand-blue)",
              background: "var(--color-brand-light)",
            }}
          >
            Contest Details
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-neutral-900)",
            }}
          >
            Everything You Need to Know
          </h2>
          <p
            className="mt-4 text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-neutral-700)" }}
          >
            A fair, transparent, and accessible contest designed for ambitious
            minds across India.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {details.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="bg-white rounded-2xl border p-6 hover:shadow-md transition-all duration-200 cursor-default"
                style={{ borderColor: "var(--color-neutral-200)" }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: item.bg }}
                >
                  <Icon size={22} style={{ color: item.color }} />
                </div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-1"
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-lg font-bold mb-1"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  {item.value}
                </p>
                <p
                  className="text-sm leading-snug"
                  style={{ color: "var(--color-neutral-700)" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
