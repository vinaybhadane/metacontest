"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "https://wa.me/";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#prizes", label: "Prizes" },
  { href: "/ambassador", label: "Campus Ambassador" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!user) {
      setIsRegistered(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (snap) => {
        if (snap.exists() && snap.data().paymentStatus === "paid") {
          setIsRegistered(true);
        } else {
          setIsRegistered(false);
        }
      },
      (error) => {
        console.error("Error checking registration status in navbar:", error);
        setIsRegistered(false);
      }
    );

    return unsubscribe;
  }, [user]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md border-b border-neutral-200" : ""
        }`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/metalogo.png"
                alt="META Contest Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="flex items-center gap-0.5">
                <span
                  className="text-xl font-bold tracking-tight"
                  style={{ color: "var(--color-brand-blue)" }}
                >
                  META
                </span>
                <span
                  className="text-xl font-semibold"
                  style={{ color: "var(--color-neutral-900)" }}
                >
                  Contest
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 hover:text-brand-blue transition-colors"
                  style={{
                    color: "var(--color-neutral-700)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-brand-blue)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-neutral-700)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full transition-colors"
                title="Join WhatsApp Channel"
                style={{ color: "#25D366" }}
                aria-label="Join WhatsApp"
              >
                <MessageCircle size={20} fill="currentColor" />
              </a>
              {isRegistered ? (
                <Link
                  href="/dashboard"
                  id="nav-dashboard-btn"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "var(--color-brand-blue)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-brand-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-brand-blue)")
                  }
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  id="nav-register-btn"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  style={{ background: "var(--color-brand-blue)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-brand-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-brand-blue)")
                  }
                >
                  Register Now
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{ color: "var(--color-neutral-700)" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b shadow-lg md:hidden overflow-hidden"
            style={{ borderColor: "var(--color-neutral-200)" }}
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    color: "var(--color-neutral-700)",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{ color: "#25D366", background: "#f0fdf4" }}
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle size={18} fill="currentColor" />
                  Join WhatsApp Channel
                </a>
                {isRegistered ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-center items-center py-3 rounded-full text-sm font-semibold text-white transition-all"
                    style={{ background: "var(--color-brand-blue)" }}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex justify-center items-center py-3 rounded-full text-sm font-semibold text-white transition-all"
                    style={{ background: "var(--color-brand-blue)" }}
                  >
                    Register Now — ₹50
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
