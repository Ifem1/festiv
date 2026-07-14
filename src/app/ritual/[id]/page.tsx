"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/festiv/Navbar";
import RitualPlanRenderer from "@/components/festiv/RitualPlanRenderer";
import ExplorerLink from "@/components/festiv/ExplorerLink";
import WalletConnectButton from "@/components/festiv/WalletConnectButton";
import { getRitual, getRitualPlan, requestRitualPlan, updateRitualBrief, markCompleted, archiveRitual, getConnectedAddress } from "@/lib/genlayer/festivClient";
import type { RitualRequest, RitualPlanRecord } from "@/types/ritual";
import { Loader, CheckCircle, Archive, RefreshCw } from "lucide-react";

const STATUS_PILL: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "#BFA6A0" },
  submitted: { label: "Submitted", color: "#62D5FF" },
  generating: { label: "Generating", color: "#E7B95B" },
  approved: { label: "Approved", color: "#A9B8A6" },
  needs_revision: { label: "Needs Revision", color: "#E7B95B" },
  unsafe: { label: "Unsafe", color: "#E46F5A" },
  archived: { label: "Archived", color: "#BFA6A0" },
  completed: { label: "Completed", color: "#7C5CFF" },
};

export default function RitualDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [ritual, setRitual] = useState<RitualRequest | null>(null);
  const [plan, setPlan] = useState<RitualPlanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [revision, setRevision] = useState({ purpose: "", groupContext: "", boundaries: "" });

  async function loadRitual() {
    setLoading(true);
    setError(null);
    try {
      const connected = await getConnectedAddress();
      setAddress(connected);
      const r = await getRitual(id, connected ?? undefined);
      setRitual(r);
      setRevision({ purpose: r.purpose, groupContext: r.group_context, boundaries: r.boundaries });
      if (["approved", "needs_revision", "unsafe", "completed"].includes(r.status)) {
        try {
          const p = await getRitualPlan(id, connected ?? undefined);
          setPlan(p);
        } catch {
          // plan not yet available
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load ritual.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRitual();
    getConnectedAddress().then(setAddress);
  }, [id]);

  async function handleRequestPlan() {
    if (!address) return;
    setGenerating(true);
    setGenError(null);
    try {
      await requestRitualPlan(id, address);
      // Tx submitted — GenLayer validators will process asynchronously.
      // Wait a moment then reload; user can also hit Refresh manually.
      await new Promise((r) => setTimeout(r, 3000));
      await loadRitual();
    } catch (e) {
      setGenError(
        e instanceof Error ? e.message : "Transaction failed. Check wallet connection and try again."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevision() {
    if (!address || !ritual) return;
    setActionLoading(true);
    setGenError(null);
    try {
      await updateRitualBrief(id, {
        purpose: revision.purpose,
        groupContext: revision.groupContext,
        boundaries: revision.boundaries,
        toneTags: ritual.tone_tags.split(",").map((value) => value.trim()).filter(Boolean),
        symbolsToInclude: ritual.symbols_to_include,
        symbolsToAvoid: ritual.symbols_to_avoid,
        culturalContext: ritual.cultural_context,
        accessibilityNeeds: ritual.accessibility_needs,
      }, address);
      setEditing(false);
      await loadRitual();
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Could not revise brief.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleMarkCompleted() {
    if (!address || !ritual) return;
    setActionLoading(true);
    try {
      await markCompleted(id, address);
      await loadRitual();
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleArchive() {
    if (!address || !ritual) return;
    setActionLoading(true);
    try {
      await archiveRitual(id, address);
      router.push("/my-rituals");
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#17111F" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader className="w-8 h-8 text-[#7C5CFF] animate-spin" />
          <p className="text-[#BFA6A0] text-sm">Loading ritual…</p>
        </div>
      </div>
    );
  }

  if (error || !ritual) {
    return (
      <div className="min-h-screen" style={{ background: "#17111F" }}>
        <Navbar />
        <div className="max-w-2xl mx-auto px-5 py-20 text-center">
          <h1 className="font-display text-3xl text-[#E46F5A] mb-3">Ritual Not Found</h1>
          <p className="text-[#BFA6A0]">{error ?? "This ritual does not exist."}</p>
        </div>
      </div>
    );
  }

  const statusPill = STATUS_PILL[ritual.status] ?? { label: ritual.status, color: "#BFA6A0" };
  const isCreator = address?.toLowerCase() === ritual.creator?.toLowerCase();
  const canRequestPlan = isCreator && ["submitted", "needs_revision"].includes(ritual.status);
  const canComplete = isCreator && ritual.status === "approved";
  const canArchive = isCreator && !["archived", "completed"].includes(ritual.status);
  const tones = ritual.tone_tags ? ritual.tone_tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />
      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-full border"
                  style={{ borderColor: statusPill.color, color: statusPill.color }}
                >
                  {statusPill.label}
                </span>
                <span className="text-xs text-[#BFA6A0] font-mono capitalize">
                  {ritual.ritual_type?.replace(/_/g, " ")}
                </span>
              </div>
              <h1 className="font-display text-4xl text-[#F7EFE2]">{ritual.title}</h1>
            </div>
            <WalletConnectButton onConnect={setAddress} />
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-mono text-[#BFA6A0] mb-4">
            <span>
              Creator:{" "}
              <ExplorerLink type="address" value={ritual.creator} />
            </span>
            <span className="text-[#BFA6A0]/40">·</span>
            <span>ID: {id}</span>
            <span className="text-[#BFA6A0]/40">·</span>
            <span>{ritual.community_name}</span>
          </div>

          {tones.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-full text-xs border border-[#BFA6A0]/20 text-[#BFA6A0]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Brief summary */}
        <div
          className="rounded-2xl p-6 border mb-6"
          style={{ borderColor: "rgba(191,166,160,0.15)", background: "rgba(255,255,255,0.02)" }}
        >
          <h2 className="font-mono text-xs text-[#BFA6A0] uppercase tracking-wide mb-3">
            Ritual Brief
          </h2>
          <p className="text-[#F7EFE2] leading-relaxed mb-4">{ritual.purpose}</p>
          {ritual.group_context && (
            <p className="text-sm text-[#BFA6A0] leading-relaxed">{ritual.group_context}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono text-[#BFA6A0]">
            {ritual.duration_preference && <span>Duration: {ritual.duration_preference}</span>}
            {ritual.location_mode && <span>Mode: {ritual.location_mode}</span>}
            {ritual.participant_count_band && <span>Participants: {ritual.participant_count_band}</span>}
          </div>
        </div>

        {isCreator && ["submitted", "needs_revision"].includes(ritual.status) && (
          <div className="mb-6">
            <button onClick={() => setEditing((value) => !value)} className="text-sm text-[#E7B95B]">
              {editing ? "Cancel revision" : "Revise brief"}
            </button>
            {editing && (
              <div className="mt-4 grid gap-3 rounded-2xl border border-[#E7B95B]/25 p-5">
                <textarea value={revision.purpose} onChange={(event) => setRevision({ ...revision, purpose: event.target.value })} aria-label="Purpose" className="rounded-lg bg-white/5 p-3 text-[#F7EFE2]" rows={3} />
                <textarea value={revision.groupContext} onChange={(event) => setRevision({ ...revision, groupContext: event.target.value })} aria-label="Group context" className="rounded-lg bg-white/5 p-3 text-[#F7EFE2]" rows={3} />
                <textarea value={revision.boundaries} onChange={(event) => setRevision({ ...revision, boundaries: event.target.value })} aria-label="Boundaries" className="rounded-lg bg-white/5 p-3 text-[#F7EFE2]" rows={3} />
                <button onClick={handleRevision} disabled={actionLoading || !revision.purpose.trim()} className="rounded-full bg-[#E7B95B] px-5 py-2 text-sm text-[#17111F] disabled:opacity-40">
                  Save revised brief
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {canRequestPlan && !generating && (
            <button
              onClick={handleRequestPlan}
              disabled={!address}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7C5CFF, #4B1F35)", color: "#F7EFE2" }}
            >
              Request GenLayer Ritual Plan
            </button>
          )}
          {canComplete && (
            <button
              onClick={handleMarkCompleted}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border border-[#A9B8A6]/40 text-[#A9B8A6] hover:border-[#A9B8A6] transition-colors"
            >
              <CheckCircle size={14} />
              Mark as Completed
            </button>
          )}
          {canArchive && (
            <button
              onClick={handleArchive}
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border border-[#BFA6A0]/20 text-[#BFA6A0]/60 hover:text-[#BFA6A0] hover:border-[#BFA6A0]/40 transition-colors"
            >
              <Archive size={14} />
              Archive
            </button>
          )}
          <button
            onClick={loadRitual}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm text-[#BFA6A0]/60 hover:text-[#BFA6A0] transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Generating state */}
        {generating && (
          <div
            className="rounded-2xl p-8 border border-[#7C5CFF]/30 bg-[#7C5CFF]/5 mb-8 text-center"
          >
            <Loader className="w-8 h-8 text-[#7C5CFF] animate-spin mx-auto mb-4" />
            <h3 className="font-display text-xl text-[#F7EFE2] mb-2">
              GenLayer validators are at work
            </h3>
            <p className="text-[#BFA6A0] text-sm max-w-md mx-auto leading-relaxed">
              Validators are interpreting the brief from different angles: tone, symbolism, cultural
              care, group context, and facilitation risk.
            </p>
          </div>
        )}

        {genError && (
          <div className="rounded-xl p-4 border border-[#E46F5A]/30 bg-[#E46F5A]/5 mb-6">
            <p className="text-sm text-[#E46F5A]">{genError}</p>
          </div>
        )}

        {/* Plan */}
        {plan && <RitualPlanRenderer planRecord={plan} />}

        {/* No wallet notice */}
        {!address && canRequestPlan && (
          <div className="mt-4 p-4 rounded-xl border border-[#BFA6A0]/15 bg-white/2">
            <p className="text-sm text-[#BFA6A0]">
              Connect your wallet to request a ritual plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
