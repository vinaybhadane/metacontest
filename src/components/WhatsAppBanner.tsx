"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "https://wa.me/";
const STORAGE_KEY = "mc_wa_banner_dismissed";

export default function WhatsAppBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds if not previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm animate-slide-up"
      role="alert"
      aria-label="WhatsApp channel invitation"
    >
      <div
        className="flex items-center gap-3 p-4 shadow-2xl border"
        style={{
          background: "#ffffff",
          borderColor: "#25D366",
          borderRadius: "0px",
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--color-neutral-900)" }}
          >
            📲 Stay Updated on WhatsApp
          </p>
          <p
            className="text-xs mt-0.5 truncate"
            style={{ color: "var(--color-neutral-500)" }}
          >
            Admit cards, exam link &amp; results
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            id="whatsapp-banner-join"
            className="text-xs font-bold px-3 py-2 rounded-full text-white transition-all"
            style={{ background: "#25D366" }}
          >
            Join Now
          </a>
          <button
            onClick={dismiss}
            className="p-1 rounded-full transition-colors"
            style={{ color: "var(--color-neutral-500)" }}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Bottom corner rounded on sm+ */}
      <style jsx>{`
        @media (min-width: 640px) {
          div[role="alert"] > div {
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
}
