"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/festiv/Navbar";
import WalletConnectButton from "@/components/festiv/WalletConnectButton";
import { getCreatorRitualIds, getRitual, getConnectedAddress } from "@/lib/genlayer/festivClient";
import type { RitualRequest } from "@/types/ritual";
import { Loader, ArrowRight, Plus, RefreshCw } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  submitted: "#62D5FF",
  generating: "#E7B95B",
  approved: "#A9B8A6",
  needs_revision: "#E7B95B",
  unsafe: "#E46F5A",
  archived: "#BFA6A0",
  completed: "#7C5CFF",
};

export default function MyRitualsPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [rituals, setRituals] = useState<RitualRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  async function loadRituals(addr: string) {
    cancelRef.current = false;
    setLoading(true);
    setError(null);
    setRituals([]);

    try {
      const ids = await getCreatorRitualIds(addr);
      if (cancelRef.current) return;

      const loaded: RitualRequest[] = [];
      for (const id of ids.slice().reverse()) {
        if (cancelRef.current) break;
        try {
          const r = await getRitual(id);
          loaded.push(r);
          // Stay under StudioNet rate limit — 1 req per 600ms max
          await new Promise((r) => setTimeout(r, 600));
        } catch {
          // skip a single missing ritual
        }
      }

      if (!cancelRef.current) setRituals(loaded);
    } catch (e) {
      if (!cancelRef.current)
        setError(e instanceof Error ? e.message : "Could not load your rituals.");
    } finally {
      if (!cancelRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    cancelRef.current = false;
    getConnectedAddress().then((addr) => {
      if (addr && !cancelRef.current) {
        setAddress(addr);
        loadRituals(addr);
      }
    });
    return () => {
      cancelRef.current = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleConnect(addr: string) {
    setAddress(addr);
    loadRituals(addr);
  }

  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-[#7C5CFF] uppercase tracking-wide mb-2">
              My Rituals
            </div>
            <h1 className="font-display text-4xl text-[#F7EFE2]">Your ceremonies</h1>
          </div>
          <div className="flex flex-col items-end gap-3">
            <WalletConnectButton onConnect={handleConnect} />
            {address && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => loadRituals(address)}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-[#BFA6A0] hover:text-[#F7EFE2] transition-colors disabled:opacity-40"
                >
                  <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
                <Link
                  href="/studio"
                  className="flex items-center gap-1.5 text-xs text-[#7C5CFF] hover:text-[#F7EFE2] transition-colors"
                >
                  <Plus size={12} />
                  New ritual
                </Link>
              </div>
            )}
          </div>
        </div>

        {!address && (
          <div
            className="rounded-2xl p-10 border text-center"
            style={{ borderColor: "rgba(191,166,160,0.15)", background: "rgba(255,255,255,0.02)" }}
          >
            <p className="text-[#BFA6A0] mb-4">Connect your wallet to view your rituals.</p>
          </div>
        )}

        {address && loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader className="w-6 h-6 text-[#7C5CFF] animate-spin" />
            <p className="text-xs text-[#BFA6A0]">Loading your ceremonies from StudioNet…</p>
          </div>
        )}

        {address && !loading && error && (
          <div className="rounded-xl p-5 border border-[#E46F5A]/30 bg-[#E46F5A]/5 space-y-3">
            <p className="text-sm text-[#E46F5A]">{error}</p>
            <button
              onClick={() => loadRituals(address)}
              className="text-xs text-[#BFA6A0] underline hover:text-[#F7EFE2]"
            >
              Try again
            </button>
          </div>
        )}

        {address && !loading && !error && rituals.length === 0 && (
          <div
            className="rounded-2xl p-12 border text-center"
            style={{ borderColor: "rgba(191,166,160,0.15)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="text-4xl mb-4 text-[#4B1F35]">◯</div>
            <h2 className="font-display text-2xl text-[#F7EFE2] mb-2">No rituals yet.</h2>
            <p className="text-[#BFA6A0] mb-6 max-w-sm mx-auto text-sm leading-relaxed">
              Start with a launch, memorial, onboarding, conflict reset, or milestone ceremony.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #7C5CFF, #4B1F35)" }}
            >
              Create your first ritual
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {!loading && rituals.length > 0 && (
          <div className="space-y-3">
            {rituals.map((r) => {
              const statusColor = STATUS_COLORS[r.status] ?? "#BFA6A0";
              const tones = r.tone_tags
                ? r.tone_tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3)
                : [];
              return (
                <Link
                  key={r.ritual_id}
                  href={`/ritual/${r.ritual_id}`}
                  className="block rounded-2xl p-5 border transition-all hover:border-[#7C5CFF]/40"
                  style={{
                    borderColor: "rgba(191,166,160,0.15)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-mono px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ borderColor: statusColor, color: statusColor }}
                        >
                          {r.status}
                        </span>
                        <span className="text-xs text-[#BFA6A0] capitalize font-mono truncate">
                          {r.ritual_type?.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h3 className="text-[#F7EFE2] font-medium truncate">{r.title}</h3>
                      <p className="text-xs text-[#BFA6A0] mt-0.5">{r.community_name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {tones.length > 0 && (
                        <div className="flex gap-1">
                          {tones.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-xs text-[#BFA6A0]/70"
                              style={{ background: "rgba(191,166,160,0.08)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <ArrowRight size={14} className="text-[#BFA6A0]/40" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
