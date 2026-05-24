import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "META Contest Terms and Conditions — Detailed rules, eligibility, and participation requirements.",
};

export default function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-neutral-500)" }}>
            Last updated: May 2026
          </p>

          <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--color-neutral-700)" }}>
            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>1.</span> Eligibility Criteria
              </h2>
              <p className="mb-2">To participate in the META Contest 2026, candidates must meet the following criteria:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Must be at least 16 years of age at the time of registration.</li>
                <li>Must be a citizen or resident of India.</li>
                <li>Open to all educational backgrounds: High school students, college/university graduates, postgraduate students, and working professionals are all eligible.</li>
                <li>All profile details submitted (Full Name, Date of Birth, Mobile, College Name, etc.) must be 100% accurate and verifiable with official government or institutional identification.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>2.</span> Requirements for Participation
              </h2>
              <p className="mb-2">Candidates must secure the following technical and general requirements to appear for the online exam:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Device:</strong> A desktop, laptop, or smartphone with a working front-facing camera or webcam.</li>
                <li><strong>Browser:</strong> Latest version of Google Chrome, Mozilla Firefox, or Safari with enabled JavaScript and cookie storage.</li>
                <li><strong>Connectivity:</strong> High-speed stable internet connection (minimum 2 Mbps download speed recommended) for the entire duration of the test.</li>
                <li><strong>Camera Access:</strong> The platform will require camera permission for proctoring. Denying camera access will prevent starting the exam.</li>
                <li><strong>Environment:</strong> A well-lit, quiet room. No other persons must be present in the room during the test.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>3.</span> Registration, Fees & Account Policy
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>The registration fee of <strong>₹50</strong> is standard for all candidates.</li>
                <li>Multiple accounts registered under the same person or different emails to attempt the quiz multiple times is strictly prohibited. If duplicate accounts are found, all attempts will be disqualified.</li>
                <li>Registration is only complete after successful online payment validation via Razorpay.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>4.</span> Exam Rules & Anti-Cheating Policy
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>The contest consists of 50 Multiple Choice Questions (MCQs) covering General Knowledge, Technology, Aptitude, and Current Affairs.</li>
                <li>The exam is fully online and proctored. AI-based camera monitoring and tab-switch tracking will be active.</li>
                <li><strong>Tab Switches:</strong> Switching tabs, closing the window, or minimizing the browser window during the exam is strictly tracked. Exceeding the maximum allowed tab-switches (3 warnings) results in automatic submission and disqualification.</li>
                <li>Any candidate caught using search engines, books, external devices, or obtaining help from another person will be disqualified immediately.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>5.</span> Prizes & Certificates
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Top scorers will win cash prizes as outlined on the website home page. Tie-breakers will be resolved based on completion time.</li>
                <li>Prizes are subject to identity verification. Winners must present a valid Government ID matching their registration profile name.</li>
                <li>Cash prizes will be credited via bank transfer or UPI within 30 days of the verified results publication.</li>
                <li>Participation certificates will be available for download in the profile dashboard for all candidates who successfully complete the exam without disqualification.</li>
              </ul>
            </section>

            <section className="border-b pb-6" style={{ borderColor: "var(--color-neutral-100)" }}>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>6.</span> Campus Ambassador Program Rules
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ambassadors must only refer genuine, unique participants. Fake or automated referral signups will lead to immediate deletion of the ambassador profile and forfeiture of all accumulated rewards.</li>
                <li>Ambassador ranking and referral leaderboards are updated in real-time. Only verified referrals (completed registrations with payment confirmed) are counted.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-3 flex items-center gap-2" style={{ color: "var(--color-neutral-900)" }}>
                <span>7.</span> Contact Information
              </h2>
              <p>
                If you have any questions or require clarifications regarding these terms and rules, please visit our{" "}
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
