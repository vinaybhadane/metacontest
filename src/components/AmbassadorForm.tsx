"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, Copy, Check, ExternalLink, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const WHATSAPP_AMBASSADOR =
  process.env.NEXT_PUBLIC_WHATSAPP_AMBASSADOR_GROUP || "https://wa.me/";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://metacontest.me";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().min(3, "College name required"),
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  whyAmbassador: z
    .string()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || v.length >= 50,
      "Please write at least 50 characters (or leave blank)"
    ),
});

type FormValues = z.infer<typeof schema>;

export default function AmbassadorForm() {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  // Pre-fill name and email when user logs in/loads
  useEffect(() => {
    if (user) {
      if (user.displayName) setValue("name", user.displayName);
      if (user.email) setValue("email", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, uid: user.uid }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to register. Please try again.");
        return;
      }

      setReferralCode(result.referralCode);
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#0064e0] focus:border-[#0064e0]";
  const inputStyle = {
    borderColor: "var(--color-neutral-200)",
    color: "var(--color-neutral-900)",
  };
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide mb-1.5";
  const labelStyle = { color: "var(--color-neutral-500)" };
  const errorStyle = { color: "#dc2626" };

  if (success) {
    const referralLink = `${APP_URL}/register?ref=${referralCode}`;
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-neutral-900)",
            }}
          >
            You&apos;re an Ambassador!
          </h3>
          <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
            Welcome to the META Contest Ambassador Program
          </p>
        </div>

        {/* Referral code */}
        <div
          className="rounded-2xl border p-5"
          style={{
            background: "var(--color-brand-light)",
            borderColor: "var(--color-brand-blue)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: "var(--color-brand-blue)" }}
          >
            Your Referral Code
          </p>
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-mono font-bold tracking-widest flex-1"
              style={{ color: "var(--color-brand-blue)" }}
            >
              {referralCode}
            </span>
            <button
              onClick={copyCode}
              className="p-2 rounded-lg"
              style={{
                background: copied ? "#d1fae5" : "white",
                color: copied ? "#16a34a" : "var(--color-brand-blue)",
              }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* Share link */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--color-neutral-500)" }}
          >
            Shareable Registration Link
          </p>
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

        {/* WhatsApp group */}
        <a
          href={WHATSAPP_AMBASSADOR}
          target="_blank"
          rel="noopener noreferrer"
          id="ambassador-whatsapp-btn"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm text-white"
          style={{ background: "#25D366" }}
        >
          <MessageCircle size={18} fill="currentColor" />
          Join Ambassador WhatsApp Group →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="amb-name">
          Full Name *
        </label>
        <input
          id="amb-name"
          type="text"
          placeholder="Your full name"
          {...register("name")}
          className={inputClass}
          style={inputStyle}
        />
        {errors.name && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* College */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="amb-college">
          College / University *
        </label>
        <input
          id="amb-college"
          type="text"
          placeholder="e.g. VESIT Mumbai"
          {...register("college")}
          className={inputClass}
          style={inputStyle}
        />
        {errors.college && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.college.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="amb-email">
          Email Address *
        </label>
        <input
          id="amb-email"
          type="email"
          placeholder="you@example.com"
          {...register("email")}
          className={inputClass}
          style={inputStyle}
        />
        {errors.email && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="amb-mobile">
          Mobile Number *
        </label>
        <input
          id="amb-mobile"
          type="tel"
          placeholder="10-digit Indian number"
          maxLength={10}
          {...register("mobile")}
          className={inputClass}
          style={inputStyle}
        />
        {errors.mobile && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* Why Ambassador */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="amb-why">
          Why do you want to be an Ambassador? (Optional — min 50 chars)
        </label>
        <textarea
          id="amb-why"
          rows={4}
          placeholder="Tell us why you'd be a great META Contest ambassador..."
          {...register("whyAmbassador")}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
        {errors.whyAmbassador && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.whyAmbassador.message}
          </p>
        )}
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "#fee2e2", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      <button
        id="ambassador-submit-btn"
        type="submit"
        disabled={!isValid || submitting || !user}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
        style={{ background: "var(--color-brand-blue)" }}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Registering...
          </>
        ) : (
          "Apply as Campus Ambassador →"
        )}
      </button>

      <p
        className="text-xs text-center"
        style={{ color: "var(--color-neutral-500)" }}
      >
        Ambassador registration is FREE. Earn through referrals only.
      </p>
    </form>
  );
}
