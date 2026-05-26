"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck, Copy, CheckCircle2, Clock, Mail, AlertTriangle } from "lucide-react";

type PaySubStep = "pay" | "utr" | "done";

interface PaymentButtonProps {
  paymentStatus?: string;
}

const UPI_ID = "contestfees@nyes";
const UPI_NAME = "META Contest";
const PAYMENT_LINK = "https://pay.mypaylink.in?q=DN3RGQ";
const AMOUNT = 50;

export default function PaymentButton({ paymentStatus }: PaymentButtonProps) {
  const { getIdToken } = useAuth();

  // If already submitted, jump straight to done screen
  const [subStep, setSubStep] = useState<PaySubStep>(
    paymentStatus === "utr_submitted" ? "done" : "pay"
  );
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateUTR = (value: string) => {
    const clean = value.trim().toUpperCase();
    if (!clean) return "UTR number is required.";
    if (!/^[A-Z0-9]{10,22}$/.test(clean))
      return "Enter a valid UTR / transaction reference number (10–22 alphanumeric characters).";
    return null;
  };

  const handleUTRSubmit = async () => {
    const clean = utr.trim().toUpperCase();
    const err = validateUTR(clean);
    if (err) {
      setUtrError(err);
      return;
    }
    setUtrError(null);

    try {
      setSubmitting(true);
      const idToken = await getIdToken();

      const res = await fetch("/api/submit-utr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ utr: clean }),
      });

      const data = await res.json();

      if (!res.ok) {
        setUtrError(data.error || "Failed to submit UTR. Please try again.");
        return;
      }

      setSubStep("done");
    } catch {
      setUtrError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Summary Card */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "var(--color-neutral-100)",
          borderColor: "var(--color-neutral-200)",
        }}
      >
        <div
          className="flex items-center justify-between py-2 border-b"
          style={{ borderColor: "var(--color-neutral-200)" }}
        >
          <span className="text-sm" style={{ color: "var(--color-neutral-700)" }}>
            Contest Entry Fee
          </span>
          <span className="font-semibold" style={{ color: "var(--color-neutral-900)" }}>
            ₹{AMOUNT}
          </span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="font-bold" style={{ color: "var(--color-neutral-900)" }}>
            Total
          </span>
          <span className="text-xl font-bold" style={{ color: "var(--color-brand-blue)" }}>
            ₹{AMOUNT}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-neutral-500)" }}>
        <ShieldCheck size={14} style={{ color: "#16a34a" }} />
        Secure manual UPI payment · Verified by admin within 2 hours
      </div>

      {/* Rejection banner (if admin rejected previous UTR) */}
      {paymentStatus === "rejected" && subStep === "pay" && (
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}
        >
          <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#dc2626" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#991b1b" }}>Previous UTR rejected</p>
            <p className="text-xs mt-0.5" style={{ color: "#7f1d1d" }}>
              Your previous UTR could not be verified. Please re-pay ₹50 and submit a new UTR number.
              Check your email for details.
            </p>
          </div>
        </div>
      )}

      {/* ── Sub-step A: Pay Fees ──────────────────────────────────── */}
      {subStep === "pay" && (
        <div className="space-y-3">
          <button
            id="pay-fees-btn"
            onClick={() => setSubStep("utr")}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            style={{ background: "var(--color-brand-blue)" }}
          >
            💳 Pay ₹{AMOUNT} — Pay Fees
          </button>
          <p className="text-xs text-center" style={{ color: "var(--color-neutral-500)" }}>
            Pay via UPI · Verify within 2 hrs
          </p>
        </div>
      )}

      {/* ── Sub-step B: UPI Details + UTR Entry ──────────────────── */}
      {subStep === "utr" && (
        <div className="space-y-4">
          {/* UPI Details card */}
          <div
            className="rounded-2xl border p-5 space-y-4"
            style={{ borderColor: "#0064e020", background: "#f0f7ff" }}
          >
            <div className="text-center">
              <p className="font-bold text-base mb-1" style={{ color: "var(--color-neutral-900)" }}>
                Scan QR or Pay via Link
              </p>
              <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                Use any UPI app — PhonePe, GPay, Paytm, BHIM
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div
                className="rounded-2xl border-2 p-2 shadow-sm"
                style={{ borderColor: "var(--color-brand-blue)", background: "#ffffff" }}
              >
                <img
                  src="/fees.png"
                  alt="UPI Payment QR Code — contestfees@nyes"
                  width={160}
                  height={160}
                  className="block rounded-xl"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>

            {/* Payment Link Button */}
            <a
              href={PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              id="pay-link-btn"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
            >
              🔗 Pay ₹{AMOUNT} via Payment Link
            </a>

            {/* UPI ID row */}
            <div
              className="rounded-xl border p-3 flex items-center justify-between gap-3"
              style={{ borderColor: "var(--color-neutral-200)", background: "#ffffff" }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-neutral-500)" }}>
                  UPI ID
                </p>
                <p className="font-bold text-sm mt-0.5 font-mono" style={{ color: "var(--color-neutral-900)" }}>
                  {UPI_ID}
                </p>
                <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                  {UPI_NAME}
                </p>
              </div>
              <button
                onClick={handleCopyUPI}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all copy-btn"
                style={{
                  background: copied ? "#dcfce7" : "var(--color-brand-light)",
                  color: copied ? "#16a34a" : "var(--color-brand-blue)",
                }}
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Steps */}
            <ol className="space-y-1.5 text-xs" style={{ color: "var(--color-neutral-700)" }}>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0" style={{ color: "var(--color-brand-blue)" }}>1.</span>
                Scan the QR or tap the payment link above and pay <strong>₹{AMOUNT}</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0" style={{ color: "var(--color-brand-blue)" }}>2.</span>
                Note the <strong>UTR / Transaction ID</strong> from your payment confirmation
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold shrink-0" style={{ color: "var(--color-brand-blue)" }}>3.</span>
                Enter the UTR below to complete your registration
              </li>
            </ol>
          </div>

          {/* UTR Input */}
          <div>
            <label
              htmlFor="utr-input"
              className="block text-xs font-semibold uppercase tracking-wide mb-1.5"
              style={{ color: "var(--color-neutral-500)" }}
            >
              UTR / Transaction Reference Number *
            </label>
            <input
              id="utr-input"
              type="text"
              placeholder="e.g. 123456789012"
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value.toUpperCase());
                setUtrError(null);
              }}
              maxLength={22}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)] font-mono tracking-widest"
              style={{
                borderColor: utrError ? "#dc2626" : "var(--color-neutral-200)",
                color: "var(--color-neutral-900)",
                background: "#ffffff",
              }}
            />
            {utrError && (
              <p className="text-xs mt-1.5" style={{ color: "#dc2626" }}>
                {utrError}
              </p>
            )}
            <p className="text-xs mt-1.5" style={{ color: "var(--color-neutral-500)" }}>
              Find your UTR in the payment confirmation screen or SMS from your bank.
            </p>
          </div>

          {/* Error Banner */}
          {utrError && utrError.includes("already") && (
            <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fee2e2", color: "#dc2626" }}>
              {utrError}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="submit-utr-btn"
            onClick={handleUTRSubmit}
            disabled={submitting || !utr.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
            style={{ background: "var(--color-brand-blue)" }}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "✅ Submit UTR for Verification"
            )}
          </button>

          <button
            onClick={() => setSubStep("pay")}
            className="w-full text-xs underline text-center"
            style={{ color: "var(--color-neutral-500)" }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── Sub-step C: Pending Verification ─────────────────────── */}
      {subStep === "done" && (
        <div
          className="rounded-2xl border p-6 text-center space-y-4"
          style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}
        >
          <div className="flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#dcfce7" }}
            >
              <Clock size={32} style={{ color: "#16a34a" }} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg" style={{ color: "#15803d" }}>
              UTR Submitted!
            </h3>
            <p className="text-sm mt-1" style={{ color: "#166534" }}>
              Your payment verification will be done within{" "}
              <strong>2 hours</strong>.
            </p>
          </div>

          <div
            className="rounded-xl p-4 text-left space-y-2"
            style={{ background: "#ffffff", border: "1px solid #bbf7d0" }}
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
              <p className="text-xs" style={{ color: "#374151" }}>
                UTR number <strong className="font-mono">{utr}</strong> recorded successfully.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Mail size={15} className="shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
              <p className="text-xs" style={{ color: "#374151" }}>
                After verification, you will receive a confirmation email with your registration details.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={15} className="shrink-0 mt-0.5" style={{ color: "#16a34a" }} />
              <p className="text-xs" style={{ color: "#374151" }}>
                Typical verification time: <strong>within 2 hours</strong> (working hours).
              </p>
            </div>
          </div>

          <p className="text-xs" style={{ color: "#6b7280" }}>
            Questions? Contact us on{" "}
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
              style={{ color: "#16a34a" }}
            >
              WhatsApp
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
