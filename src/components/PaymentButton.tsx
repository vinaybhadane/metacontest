"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function PaymentButton() {
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        setError("Payment service failed to load. Please refresh and try again.");
        return;
      }

      const idToken = await getIdToken();

      // Create order on server
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        setError(data.error || "Failed to create order. Please try again.");
        return;
      }

      const { orderId, amount, currency } = await orderRes.json();

      // Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount,
        currency,
        name: "META Contest",
        description: "Contest Registration Fee",
        order_id: orderId,
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: { color: "#0064E0" },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                uid: user.uid,
              }),
            });

            if (!verifyRes.ok) {
              setError("Payment verification failed. Please contact support.");
              return;
            }

            // Send confirmation email
            await fetch("/api/send-confirmation", {
              method: "POST",
              headers: { Authorization: `Bearer ${idToken}` },
            });

            // Set session cookie
            document.cookie = "mc_session=1; path=/; max-age=86400; SameSite=Lax";

            router.push("/dashboard");
          } catch {
            setError("Payment verified but setup failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment summary card */}
      <div
        className="rounded-2xl border p-5"
        style={{
          background: "var(--color-neutral-100)",
          borderColor: "var(--color-neutral-200)",
        }}
      >
        <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--color-neutral-200)" }}>
          <span className="text-sm" style={{ color: "var(--color-neutral-700)" }}>
            Contest Entry Fee
          </span>
          <span className="font-semibold" style={{ color: "var(--color-neutral-900)" }}>
            ₹50
          </span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="font-bold" style={{ color: "var(--color-neutral-900)" }}>
            Total
          </span>
          <span
            className="text-xl font-bold"
            style={{ color: "var(--color-brand-blue)" }}
          >
            ₹50
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-neutral-500)" }}>
        <ShieldCheck size={14} style={{ color: "#16a34a" }} />
        Secured by Razorpay · 256-bit encryption
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
        id="pay-now-btn"
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
        style={{ background: "var(--color-brand-blue)" }}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Processing...
          </>
        ) : (
          "💳 Pay ₹50 & Complete Registration"
        )}
      </button>
    </div>
  );
}
