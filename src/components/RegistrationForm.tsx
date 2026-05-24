"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const DEGREES = [
  "10th",
  "12th",
  "Diploma",
  "B.Tech/B.E.",
  "BCA",
  "BBA",
  "B.Sc",
  "B.Com",
  "BA",
  "M.Tech",
  "MBA",
  "MCA",
  "M.Sc",
  "PhD",
  "Working Professional",
  "Other",
];

const schema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters").max(80),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const birth = new Date(val);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      const exactAge =
        m < 0 || (m === 0 && today.getDate() < birth.getDate())
          ? age - 1
          : age;
      return exactAge >= 16;
    }, "You must be at least 16 years old to participate"),
  college: z.string().min(3, "College name is required").max(120),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  degree: z.string().min(1, "Please select your degree"),
  referralCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RegistrationFormProps {
  user: User;
  referralFromUrl?: string;
  onSuccess: () => void;
}

export default function RegistrationForm({
  user,
  referralFromUrl,
  onSuccess,
}: RegistrationFormProps) {
  const [referralStatus, setReferralStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      referralCode: referralFromUrl || "",
    },
  });

  const referralCodeValue = watch("referralCode");

  // Auto-validate referral code from URL on mount
  useEffect(() => {
    if (referralFromUrl) {
      validateReferralCode(referralFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referralFromUrl]);

  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 5) {
      setReferralStatus("idle");
      return;
    }
    setReferralStatus("checking");
    try {
      // Query ambassadors collection for this referral code
      const { collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const q = query(
        collection(db, "ambassadors"),
        where("referralCode", "==", code.toUpperCase())
      );
      const snap = await getDocs(q);
      setReferralStatus(snap.empty ? "invalid" : "valid");
    } catch {
      setReferralStatus("idle");
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const { generateReferralCode } = await import("@/lib/referral");
      const myReferralCode = generateReferralCode(data.fullName);

      // Resolve referredBy uid if valid referral code
      let referredByUid: string | null = null;
      if (data.referralCode && referralStatus === "valid") {
        const { collection, query, where, getDocs } = await import(
          "firebase/firestore"
        );
        const q = query(
          collection(db, "ambassadors"),
          where("referralCode", "==", data.referralCode.toUpperCase())
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          referredByUid = snap.docs[0].id;
        }
      }

      // Save profile to Firestore
      const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: data.fullName,
        dob: data.dob,
        college: data.college,
        mobile: data.mobile,
        degree: data.degree,
        referralCode: myReferralCode,
        referredBy: referredByUid,
        paymentStatus: "pending_payment",
        createdAt: serverTimestamp(),
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2";
  const inputStyle = {
    borderColor: "var(--color-neutral-200)",
    color: "var(--color-neutral-900)",
    background: "#ffffff",
  };
  const inputFocusStyle = `focus:ring-[var(--color-brand-blue)] focus:border-[var(--color-brand-blue)]`;
  const errorStyle = { color: "#dc2626" };
  const labelClass = "block text-xs font-semibold uppercase tracking-wide mb-1.5";
  const labelStyle = { color: "var(--color-neutral-500)" };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email — readonly */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Email Address
        </label>
        <input
          type="email"
          value={user.email || ""}
          readOnly
          className={`${inputClass} cursor-not-allowed opacity-70`}
          style={{ ...inputStyle, background: "var(--color-neutral-100)" }}
        />
      </div>

      {/* Full Name */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="fullName">
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="e.g. Ravi Sharma"
          {...register("fullName")}
          className={`${inputClass} ${inputFocusStyle}`}
          style={inputStyle}
        />
        {errors.fullName && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="dob">
          Date of Birth * (must be ≥ 16 years)
        </label>
        <input
          id="dob"
          type="date"
          {...register("dob")}
          className={`${inputClass} ${inputFocusStyle}`}
          style={inputStyle}
          max={new Date(Date.now() - 16 * 365.25 * 86400000)
            .toISOString()
            .split("T")[0]}
        />
        {errors.dob && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.dob.message}
          </p>
        )}
      </div>

      {/* College */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="college">
          College / University Name *
        </label>
        <input
          id="college"
          type="text"
          placeholder="e.g. PVPIT Pune"
          {...register("college")}
          className={`${inputClass} ${inputFocusStyle}`}
          style={inputStyle}
        />
        {errors.college && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.college.message}
          </p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="mobile">
          Mobile Number *
        </label>
        <input
          id="mobile"
          type="tel"
          placeholder="10-digit Indian number"
          maxLength={10}
          {...register("mobile")}
          className={`${inputClass} ${inputFocusStyle}`}
          style={inputStyle}
        />
        {errors.mobile && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.mobile.message}
          </p>
        )}
      </div>

      {/* Degree */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="degree">
          Current Degree *
        </label>
        <select
          id="degree"
          {...register("degree")}
          className={`${inputClass} ${inputFocusStyle}`}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="">Select your degree</option>
          {DEGREES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        {errors.degree && (
          <p className="text-xs mt-1" style={errorStyle}>
            {errors.degree.message}
          </p>
        )}
      </div>

      {/* Referral Code */}
      <div>
        <label className={labelClass} style={labelStyle} htmlFor="referralCode">
          Referral Code (Optional)
        </label>
        <div className="relative">
          <input
            id="referralCode"
            type="text"
            placeholder="e.g. MC-PRIY-B7Z2"
            {...register("referralCode")}
            onBlur={(e) => validateReferralCode(e.target.value)}
            onChange={(e) => {
              setValue("referralCode", e.target.value.toUpperCase());
              setReferralStatus("idle");
            }}
            className={`${inputClass} ${inputFocusStyle} pr-10`}
            style={inputStyle}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {referralStatus === "checking" && (
              <Loader2 size={16} className="animate-spin" style={{ color: "var(--color-neutral-500)" }} />
            )}
            {referralStatus === "valid" && (
              <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            )}
            {referralStatus === "invalid" && (
              <XCircle size={16} style={{ color: "#dc2626" }} />
            )}
          </div>
        </div>
        {referralStatus === "valid" && (
          <p className="text-xs mt-1" style={{ color: "#16a34a" }}>
            ✓ Valid referral code applied!
          </p>
        )}
        {referralStatus === "invalid" && (
          <p className="text-xs mt-1" style={errorStyle}>
            Invalid referral code. Leave blank to continue without it.
          </p>
        )}
      </div>

      {submitError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "#fee2e2", color: "#dc2626" }}
        >
          {submitError}
        </div>
      )}

      <button
        id="registration-submit-btn"
        type="submit"
        disabled={!isValid || submitting}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg"
        style={{ background: "var(--color-brand-blue)" }}
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Saving...
          </>
        ) : (
          "Save & Continue to Payment →"
        )}
      </button>
    </form>
  );
}
