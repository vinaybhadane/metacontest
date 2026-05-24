"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "https://wa.me/";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Register", href: "/register" },
    { label: "Campus Ambassador", href: "/ambassador" },
    { label: "Prizes", href: "/#prizes" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Cancellation & Refund", href: "/refund" },
  ],
};

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        background: "var(--color-neutral-900)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/metalogo.png"
                alt="META Contest Logo"
                className="w-8 h-8 object-contain"
              />
              <div className="flex items-center gap-0.5">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-brand-blue)" }}
                >
                  META
                </span>
                <span className="text-2xl font-semibold text-white">Contest</span>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed max-w-sm mb-6"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              India&apos;s most open online quiz competition. Test your
              knowledge, win big, and earn your certificate.
            </p>
            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all"
              style={{
                background: "#25D366",
                color: "#ffffff",
              }}
            >
              <MessageCircle size={16} fill="currentColor" />
              Join WhatsApp Channel
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-brand-blue)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2026 META Contest. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            Hosted at{" "}
            <span style={{ color: "var(--color-brand-blue)" }}>
              metacontest.me
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
