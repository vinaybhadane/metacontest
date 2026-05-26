"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import RegistrationForm from "@/components/RegistrationForm";
import PaymentButton from "@/components/PaymentButton";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";

type Step = 1 | 2 | 3;

const stepLabels = ["Sign In", "Your Details", "Payment"];

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepLabels.map((label, i) => {
        const n = (i + 1) as Step;
        const isActive = step === n;
        const isDone = step > n;
        return (
          <div key={n} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  background: isDone
                    ? "#16a34a"
                    : isActive
                      ? "var(--color-brand-blue)"
                      : "var(--color-neutral-200)",
                  color: isDone || isActive ? "#ffffff" : "var(--color-neutral-500)",
                }}
              >
                {isDone ? <CheckCircle2 size={16} /> : n}
              </div>
              <span
                className="text-xs mt-1 font-medium"
                style={{
                  color: isActive
                    ? "var(--color-brand-blue)"
                    : isDone
                      ? "#16a34a"
                      : "var(--color-neutral-500)",
                }}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className="w-12 h-0.5 mb-4 transition-all"
                style={{
                  background:
                    step > n
                      ? "#16a34a"
                      : "var(--color-neutral-200)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RegisterContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || undefined;

  const [step, setStep] = useState<Step>(1);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending_payment");

  // Once user logs in, check their existing registration status
  useEffect(() => {
    if (!user) return;

    const checkStatus = async () => {
      setCheckingStatus(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.paymentStatus === "paid") {
            // Set session cookie and redirect
            document.cookie = "mc_session=1; path=/; max-age=86400; SameSite=Lax";
            router.push("/dashboard");
            return;
          }
          // Profile exists but not paid — store status and skip to payment
          setPaymentStatus(data.paymentStatus || "pending_payment");
          setStep(3);
        } else {
          // New user — go to form
          setStep(2);
        }
      } catch {
        setStep(2);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkStatus();
  }, [user, router]);


  if (loading || checkingStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--color-brand-blue)" }}
        />
        <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar step={step} />

      {/* Step 1: Sign In */}
      {step === 1 && (
        <div>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">👤</div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-neutral-900)",
              }}
            >
              Create Your Account
            </h1>
            <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
              Sign in to get started
            </p>
          </div>
          
          <GoogleAuthButton onSuccess={() => {}} />

          <p
            className="text-xs text-center mt-4"
            style={{ color: "var(--color-neutral-500)" }}
          >
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline" style={{ color: "var(--color-brand-blue)" }}>
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link href="/privacy" className="underline" style={{ color: "var(--color-brand-blue)" }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && user && (
        <div>
          <div className="text-center mb-6">
            <h2
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-neutral-900)",
              }}
            >
              Tell Us About Yourself
            </h2>
            <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
              Signed in as <strong>{user.email}</strong>
            </p>
          </div>
          <RegistrationForm
            user={user}
            referralFromUrl={refCode}
            onSuccess={() => setStep(3)}
          />
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && user && (
        <div>
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">💳</div>
            <h2
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-neutral-900)",
              }}
            >
              Complete Registration
            </h2>
            <p className="text-sm" style={{ color: "var(--color-neutral-500)" }}>
              One last step — pay ₹50 to secure your spot!
            </p>
          </div>
          <PaymentButton paymentStatus={paymentStatus} />
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 px-4"
      style={{ background: "var(--color-neutral-100)" }}
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2">
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
            <span
              className="text-2xl font-semibold"
              style={{ color: "var(--color-neutral-900)" }}
            >
              Contest
            </span>
          </div>
        </Link>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl border p-8 md:p-10"
        style={{ borderColor: "var(--color-neutral-200)" }}
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-brand-blue)" }} />
            </div>
          }
        >
          <RegisterContent />
        </Suspense>
      </div>

      <p
        className="text-center text-xs mt-6"
        style={{ color: "var(--color-neutral-500)" }}
      >
        Questions?{" "}
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "var(--color-brand-blue)" }}
        >
          Contact us on WhatsApp
        </a>
      </p>
    </div>
  );
}
