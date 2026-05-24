"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(4, "Subject must be at least 4 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to send message. Please try again.");
        return;
      }

      setSuccess(true);
      reset();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)]";
  const inputStyle = {
    borderColor: "var(--color-neutral-200)",
    color: "var(--color-neutral-900)",
    background: "#ffffff",
  };
  const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1.5";
  const labelStyle = { color: "var(--color-neutral-500)" };
  const errorStyle = { color: "#dc2626" };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16" style={{ background: "var(--color-neutral-100)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1
              className="text-4xl font-normal mb-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-neutral-900)" }}
            >
              Contact Us
            </h1>
            <p className="text-neutral-500 max-w-md mx-auto text-sm" style={{ color: "var(--color-neutral-500)" }}>
              Have questions about registration, the test, or ambassador program? Reach out to us.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Contact info */}
            <div className="md:col-span-2 space-y-6">
              <div
                className="bg-white rounded-3xl border p-8 shadow-sm flex flex-col justify-between h-full"
                style={{ borderColor: "var(--color-neutral-200)" }}
              >
                <div className="space-y-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--color-brand-light)" }}
                  >
                    <Mail size={24} style={{ color: "var(--color-brand-blue)" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1" style={{ color: "var(--color-neutral-900)" }}>
                      Email Support
                    </h3>
                    <p className="text-sm mb-3" style={{ color: "var(--color-neutral-500)" }}>
                      Our team typically responds within 12-24 hours.
                    </p>
                    <a
                      href="mailto:contestmeta@gmail.com"
                      className="text-lg font-semibold underline break-all"
                      style={{ color: "var(--color-brand-blue)" }}
                    >
                      contestmeta@gmail.com
                    </a>
                  </div>
                </div>

                <div className="pt-8 border-t" style={{ borderColor: "var(--color-neutral-100)" }}>
                  <p className="text-xs" style={{ color: "var(--color-neutral-500)" }}>
                    📍 META Contest 2026 is an open online quiz event organized for students and professionals across India.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-3">
              <div
                className="bg-white rounded-3xl border p-8 md:p-10 shadow-sm"
                style={{ borderColor: "var(--color-neutral-200)" }}
              >
                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: "var(--color-neutral-900)" }}>
                      Message Sent!
                    </h3>
                    <p className="text-sm text-neutral-500 max-w-sm mx-auto" style={{ color: "var(--color-neutral-500)" }}>
                      Thank you for contacting us. We have received your query and will reply to your email address shortly.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-4 px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-all hover:bg-neutral-50"
                      style={{ borderColor: "var(--color-brand-blue)", color: "var(--color-brand-blue)" }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-neutral-900)" }}>
                      Send Us a Message
                    </h3>

                    {/* Name */}
                    <div>
                      <label className={labelClass} style={labelStyle} htmlFor="contact-name">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
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

                    {/* Email */}
                    <div>
                      <label className={labelClass} style={labelStyle} htmlFor="contact-email">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
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

                    {/* Subject */}
                    <div>
                      <label className={labelClass} style={labelStyle} htmlFor="contact-subject">
                        Subject *
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        placeholder="What is this regarding?"
                        {...register("subject")}
                        className={inputClass}
                        style={inputStyle}
                      />
                      {errors.subject && (
                        <p className="text-xs mt-1" style={errorStyle}>
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className={labelClass} style={labelStyle} htmlFor="contact-message">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        placeholder="Write details of your query here..."
                        {...register("message")}
                        className={`${inputClass} resize-none`}
                        style={inputStyle}
                      />
                      {errors.message && (
                        <p className="text-xs mt-1" style={errorStyle}>
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {error && (
                      <div
                        className="rounded-xl px-4 py-3 text-sm flex items-start gap-2.5"
                        style={{ background: "#fee2e2", color: "#dc2626" }}
                      >
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={!isValid || submitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ background: "var(--color-brand-blue)" }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>

                    <p className="text-center text-xs" style={{ color: "var(--color-neutral-400)" }}>
                      * Limit of 2 queries per email per day.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
