"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ShieldCheck,
  LogOut,
  RefreshCw,
  AlertCircle,
  Award,
  CreditCard,
} from "lucide-react";

const ADMIN_EMAIL = "vinaybhadane06@gmail.com";

interface PendingUser {
  uid: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  mobile: string;
  utr: string;
  utrSubmittedAt: string | null;
}

interface PendingAmbassador {
  uid: string;
  name: string;
  email: string;
  college: string;
  mobile: string;
  whyAmbassador: string;
  createdAt: string | null;
}

interface Stats { total: number; pending: number; approved: number; rejected: number; }
type ActionState = "idle" | "loading" | "done" | "error";
type Tab = "payments" | "ambassadors";

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function AdminPage() {
  const { user, loading, signOut, getIdToken } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("payments");

  // Data
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [pendingAmb, setPendingAmb] = useState<PendingAmbassador[]>([]);
  const [ambStats, setAmbStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Per-row action state
  const [payActionStates, setPayActionStates] = useState<Record<string, ActionState>>({});
  const [payActionErrors, setPayActionErrors] = useState<Record<string, string>>({});
  const [ambActionStates, setAmbActionStates] = useState<Record<string, ActionState>>({});
  const [ambActionErrors, setAmbActionErrors] = useState<Record<string, string>>({});

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) router.replace("/");
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    if (!user || user.email !== ADMIN_EMAIL) return;
    setLoadingData(true);
    setDataError(null);
    try {
      const idToken = await getIdToken();
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) {
        const d = await res.json();
        setDataError(d.error || "Failed to load data.");
        return;
      }
      const data = await res.json();
      setPendingUsers(data.pendingUsers);
      setStats(data.stats);
      setPendingAmb(data.pendingAmbassadors);
      setAmbStats(data.ambStats);
    } catch {
      setDataError("Network error. Please refresh.");
    } finally {
      setLoadingData(false);
    }
  }, [user, getIdToken]);

  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) fetchData();
  }, [user, fetchData]);

  const handlePayAction = useCallback(async (uid: string, action: "approve" | "reject") => {
    setPayActionStates((p) => ({ ...p, [uid]: "loading" }));
    setPayActionErrors((p) => ({ ...p, [uid]: "" }));
    try {
      const idToken = await getIdToken();
      const res = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPayActionStates((p) => ({ ...p, [uid]: "error" }));
        setPayActionErrors((p) => ({ ...p, [uid]: data.error || "Action failed." }));
        return;
      }
      setPayActionStates((p) => ({ ...p, [uid]: "done" }));
      setTimeout(() => fetchData(), 800);
    } catch {
      setPayActionStates((p) => ({ ...p, [uid]: "error" }));
      setPayActionErrors((p) => ({ ...p, [uid]: "Network error." }));
    }
  }, [getIdToken, fetchData]);

  const handleAmbAction = useCallback(async (uid: string, action: "approve" | "reject") => {
    setAmbActionStates((p) => ({ ...p, [uid]: "loading" }));
    setAmbActionErrors((p) => ({ ...p, [uid]: "" }));
    try {
      const idToken = await getIdToken();
      const res = await fetch("/api/admin/approve-ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAmbActionStates((p) => ({ ...p, [uid]: "error" }));
        setAmbActionErrors((p) => ({ ...p, [uid]: data.error || "Action failed." }));
        return;
      }
      setAmbActionStates((p) => ({ ...p, [uid]: "done" }));
      setTimeout(() => fetchData(), 800);
    } catch {
      setAmbActionStates((p) => ({ ...p, [uid]: "error" }));
      setAmbActionErrors((p) => ({ ...p, [uid]: "Network error." }));
    }
  }, [getIdToken, fetchData]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f172a" }}>
      <Loader2 size={40} className="animate-spin" style={{ color: "#3b82f6" }} />
    </div>
  );
  if (!user || user.email !== ADMIN_EMAIL) return null;

  // ── Reusable action buttons ────────────────────────────────────
  const ActionButtons = ({
    uid, aState, aError, onApprove, onReject,
  }: {
    uid: string; aState: ActionState; aError: string;
    onApprove: () => void; onReject: () => void;
  }) => (
    aState === "done" ? (
      <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#10b981" }}>
        <CheckCircle2 size={16} /> Done…
      </span>
    ) : (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove} disabled={aState === "loading"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
            style={{ background: "#059669" }}
          >
            {aState === "loading" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            Approve
          </button>
          <button
            onClick={onReject} disabled={aState === "loading"}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
            style={{ background: "#dc2626" }}
          >
            <XCircle size={12} /> Reject
          </button>
        </div>
        {aState === "error" && aError && (
          <div className="flex items-start gap-1.5 text-xs" style={{ color: "#f87171" }}>
            <AlertCircle size={12} className="shrink-0 mt-0.5" /> {aError}
          </div>
        )}
      </div>
    )
  );

  return (
    <div className="min-h-screen" style={{ background: "#0f172a", fontFamily: "var(--font-body)" }}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "#1e293b", borderColor: "#334155" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0064e0,#1877f2)" }}>
              <ShieldCheck size={18} color="white" />
            </div>
            <div>
              <p className="font-bold text-white leading-none">META Contest</p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-semibold text-white">{user.email}</p>
              <p className="text-xs" style={{ color: "#10b981" }}>● Admin</p>
            </div>
            <button id="admin-refresh-btn" onClick={fetchData} disabled={loadingData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80 disabled:opacity-50"
              style={{ background: "#334155", color: "#cbd5e1" }}>
              <RefreshCw size={13} className={loadingData ? "animate-spin" : ""} /> Refresh
            </button>
            <button id="admin-signout-btn" onClick={() => { signOut(); router.replace("/"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "#334155", color: "#cbd5e1" }}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Page Title ──────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
            Manage payment verifications and ambassador approvals.
          </p>
        </div>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <div className="flex gap-2 border-b" style={{ borderColor: "#334155" }}>
          {([
            { key: "payments", label: "Payment Verifications", icon: CreditCard, badge: stats.pending },
            { key: "ambassadors", label: "Ambassador Applications", icon: Award, badge: ambStats.pending },
          ] as const).map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px"
              style={{
                borderColor: tab === key ? "#3b82f6" : "transparent",
                color: tab === key ? "#60a5fa" : "#64748b",
                background: "transparent",
              }}
            >
              <Icon size={15} />
              {label}
              {badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: tab === key ? "#1e3a5f" : "#1e293b", color: tab === key ? "#60a5fa" : "#94a3b8" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 1 — PAYMENTS                                      */}
        {/* ══════════════════════════════════════════════════════ */}
        {tab === "payments" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Registrations", value: stats.total, icon: Users, color: "#3b82f6", bg: "#1e3a5f" },
                { label: "Pending Review", value: stats.pending, icon: Clock, color: "#f59e0b", bg: "#422006" },
                { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "#10b981", bg: "#052e16" },
                { label: "Rejected", value: stats.rejected, icon: XCircle, color: "#ef4444", bg: "#450a0a" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="rounded-2xl border p-5" style={{ background: "#1e293b", borderColor: "#334155" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="text-2xl font-bold text-white">{loadingData ? "—" : value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "#1e293b", borderColor: "#334155" }}>
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "#334155" }}>
                <Clock size={16} style={{ color: "#f59e0b" }} />
                <h2 className="font-bold text-white">Pending UTR Verifications</h2>
                {pendingUsers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#422006", color: "#f59e0b" }}>
                    {pendingUsers.length}
                  </span>
                )}
              </div>

              {dataError ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <AlertCircle size={32} style={{ color: "#ef4444" }} />
                  <p className="text-sm text-white">{dataError}</p>
                  <button onClick={fetchData} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "#3b82f6" }}>Retry</button>
                </div>
              ) : loadingData ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin" style={{ color: "#3b82f6" }} />
                </div>
              ) : pendingUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <CheckCircle2 size={40} style={{ color: "#10b981" }} />
                  <p className="font-semibold text-white">All caught up!</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>No pending UTR verifications.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #334155" }}>
                        {["Contestant", "College / Degree", "UTR Number", "Submitted At", "Actions"].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map((u, idx) => {
                        const aState = payActionStates[u.uid] || "idle";
                        const aError = payActionErrors[u.uid] || "";
                        return (
                          <tr key={u.uid} style={{ background: aState === "done" ? "#0d2b1a" : idx % 2 === 0 ? "transparent" : "#162032", borderBottom: "1px solid #1e293b", transition: "background 0.4s" }}>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-white text-sm">{u.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{u.email}</p>
                              <p className="text-xs" style={{ color: "#64748b" }}>📱 {u.mobile}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-white">{u.college}</p>
                              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{u.degree}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm px-2 py-1 rounded-lg" style={{ background: "#0f172a", color: "#38bdf8" }}>{u.utr}</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm" style={{ color: "#94a3b8" }}>{fmt(u.utrSubmittedAt)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <ActionButtons uid={u.uid} aState={aState} aError={aError}
                                onApprove={() => handlePayAction(u.uid, "approve")}
                                onReject={() => handlePayAction(u.uid, "reject")} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB 2 — AMBASSADORS                                   */}
        {/* ══════════════════════════════════════════════════════ */}
        {tab === "ambassadors" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Applications", value: ambStats.total, icon: Users, color: "#a78bfa", bg: "#2e1065" },
                { label: "Pending Review", value: ambStats.pending, icon: Clock, color: "#f59e0b", bg: "#422006" },
                { label: "Approved", value: ambStats.approved, icon: CheckCircle2, color: "#10b981", bg: "#052e16" },
                { label: "Rejected", value: ambStats.rejected, icon: XCircle, color: "#ef4444", bg: "#450a0a" },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="rounded-2xl border p-5" style={{ background: "#1e293b", borderColor: "#334155" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <p className="text-2xl font-bold text-white">{loadingData ? "—" : value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "#1e293b", borderColor: "#334155" }}>
              <div className="px-6 py-4 border-b flex items-center gap-2" style={{ borderColor: "#334155" }}>
                <Award size={16} style={{ color: "#a78bfa" }} />
                <h2 className="font-bold text-white">Pending Ambassador Applications</h2>
                {pendingAmb.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#2e1065", color: "#a78bfa" }}>
                    {pendingAmb.length}
                  </span>
                )}
              </div>

              {loadingData ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin" style={{ color: "#3b82f6" }} />
                </div>
              ) : pendingAmb.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <CheckCircle2 size={40} style={{ color: "#10b981" }} />
                  <p className="font-semibold text-white">All caught up!</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>No pending ambassador applications.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #334155" }}>
                        {["Applicant", "College", "Why Ambassador", "Applied At", "Actions"].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAmb.map((a, idx) => {
                        const aState = ambActionStates[a.uid] || "idle";
                        const aError = ambActionErrors[a.uid] || "";
                        return (
                          <tr key={a.uid} style={{ background: aState === "done" ? "#0d2b1a" : idx % 2 === 0 ? "transparent" : "#162032", borderBottom: "1px solid #1e293b", transition: "background 0.4s" }}>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-white text-sm">{a.name}</p>
                              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{a.email}</p>
                              <p className="text-xs" style={{ color: "#64748b" }}>📱 {a.mobile}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-white">{a.college}</p>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                                {a.whyAmbassador ? (
                                  a.whyAmbassador.length > 120 ? a.whyAmbassador.slice(0, 120) + "…" : a.whyAmbassador
                                ) : <span style={{ color: "#475569" }}>—</span>}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm" style={{ color: "#94a3b8" }}>{fmt(a.createdAt)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <ActionButtons uid={a.uid} aState={aState} aError={aError}
                                onApprove={() => handleAmbAction(a.uid, "approve")}
                                onReject={() => handleAmbAction(a.uid, "reject")} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-center pb-4" style={{ color: "#334155" }}>
          Admin access restricted to {ADMIN_EMAIL} · All actions logged in Firestore
        </p>
      </main>
    </div>
  );
}
