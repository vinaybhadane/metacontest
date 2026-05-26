import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "META Contest Cancellation and Refund Policy — Registration fee is strictly non-refundable.",
};

export default function RefundPage() {
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
            Cancellation &amp; Refund Policy
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-neutral-500)" }}>
            Last updated: May 2026
          </p>

          <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--color-neutral-700)" }}>
            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>1.</span> Non-Refundable Policy
              </h2>
              <p>
                The entry fee for META Contest 2026 is <strong>₹50</strong>. Please note that this registration fee is <strong>strictly non-refundable</strong> under any circumstances. Once a payment is completed and verified via our payment gateway, no refund requests will be entertained.
              </p>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>2.</span> Inability to Participate / Missed Exam
              </h2>
              <p>
                If a registered candidate is unable to appear for the online exam on June 6, 2026 at 1:00 PM, due to technical issues on the candidate's end (including but not limited to slow internet speed, lack of power backup, device crash, camera failure), personal emergencies, or scheduling conflicts, the registration fee will not be refunded, and the slot cannot be transferred to another participant.
              </p>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>3.</span> Cancellation of Registration
              </h2>
              <p>
                Candidates are free to cancel their participation or delete their accounts at any time. However, cancelling your registration does not make you eligible for a refund of the entry fee.
              </p>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>4.</span> Payment Failure / Double Deduction
              </h2>
              <p>
                In case of a payment failure where money is deducted from your bank account but the registration is not marked as successful:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Such deductions are typically held by your bank or the payment gateway and will automatically be refunded to your original source account within 5-7 working days.</li>
                <li>If you make a duplicate payment for the same registration profile, please reach out to us at <a href="mailto:contestmeta@gmail.com" className="font-semibold underline" style={{ color: "var(--color-brand-blue)" }}>contestmeta@gmail.com</a> with screenshots of both payment transactions. We will verify and process a refund for the duplicate transaction.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>5.</span> Contact Support
              </h2>
              <p>
                For any billing, transaction discrepancies, or refund queries, please visit our{" "}
                <Link href="/contact" className="font-semibold underline" style={{ color: "var(--color-brand-blue)" }}>
                  Contact Us
                </Link>{" "}
                page or email us directly at{" "}
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
