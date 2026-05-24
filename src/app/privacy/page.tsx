import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "META Contest Privacy Policy — Details on how we collect, use, and securely store your personal data.",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen py-16 px-4 animate-fade-in"
      style={{ background: "var(--color-neutral-100)" }}
    >
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <img
            src="/metalogo.png"
            alt="META Contest Logo"
            className="w-7 h-7 object-contain transition-transform group-hover:rotate-12"
          />
          <div className="flex items-center gap-0.5">
            <span className="text-xl font-bold" style={{ color: "var(--color-brand-blue)" }}>META</span>
            <span className="text-xl font-semibold" style={{ color: "var(--color-neutral-900)" }}>Contest</span>
          </div>
        </Link>

        <div className="bg-white rounded-3xl border p-8 md:p-12 shadow-sm" style={{ borderColor: "var(--color-neutral-200)" }}>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-neutral-900)" }}>
            Privacy Policy
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-neutral-500)" }}>
            Last updated: May 2026
          </p>

          <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--color-neutral-700)" }}>
            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>1.</span> Information We Collect
              </h2>
              <p className="mb-2">We collect only necessary personal identification information to manage registrations and verify participants:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Registration Details:</strong> Full Name, Email Address, Date of Birth, College/University, Degree, and Indian Mobile Number.</li>
                <li><strong>Payment Identifiers:</strong> Razorpay Payment ID and Order ID (processed securely, we never see or store your UPI PIN, credit/debit card numbers, or banking credentials).</li>
                <li><strong>Ambassador Data:</strong> Real name, college name, email, mobile number, and unique referral tracking stats.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>2.</span> How Data is Securely Stored & Protected
              </h2>
              <p className="mb-3">We implement multiple layers of security to ensure your personal data is protected against unauthorized access, alterations, or disclosures:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Google Cloud Infrastructure:</strong> All user records, registration data, and test stats are hosted on Google Firebase Firestore database servers, backed by Google Cloud Platform (GCP) enterprise-grade secure data centers.</li>
                <li><strong>Data Encryption at Rest:</strong> Firestore databases automatically encrypt all data before writing to disk using 256-bit Advanced Encryption Standard (AES-256).</li>
                <li><strong>Data Encryption in Transit:</strong> All communication between your device browser and our server endpoints is protected using HTTPS with Secure Sockets Layer/Transport Layer Security (SSL/TLS) encryption.</li>
                <li><strong>Strict Security Rules:</strong> Database read and write operations are regulated by server-side Firebase Security Rules. Users can ONLY read and write their own profile records. Admin-only fields (like payment status and referral counts) cannot be modified by users and can only be updated securely via our private server-side Admin SDK credentials.</li>
                <li><strong>No Plaintext Secrets:</strong> API private keys, mail server keys, and database server credentials are stored as secure environment variables on our servers and are never exposed to client-side code.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>3.</span> How We Use Your Information
              </h2>
              <p className="mb-2">We use the collected information for the following specific purposes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To confirm your test registration and validate entry fee payment.</li>
                <li>To generate and issue your contest admit card, exam login link, and results.</li>
                <li>To contact you with urgent notifications regarding exam timelines.</li>
                <li>To issue official downloadable participation and ranking certificates.</li>
                <li>To verify identity and disburse cash prizes to legitimate winners.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>4.</span> Third-Party Service Providers
              </h2>
              <p className="mb-2">We integrate industry-leading third-party services to handle payment processing, authentication, and communication securely:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Firebase Authentication:</strong> Google-managed OAuth service for secure account creation/login.</li>
                <li><strong>Razorpay:</strong> PCI-DSS compliant secure payment gateway for handling payment transactions.</li>
                <li><strong>Mailjet:</strong> Trusted transactional email delivery service used to dispatch confirmation emails.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>5.</span> Contact Us
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding your personal data and privacy, please write to us at{" "}
                <a href="mailto:contestmeta@gmail.com" className="font-semibold underline" style={{ color: "var(--color-brand-blue)" }}>
                  contestmeta@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
