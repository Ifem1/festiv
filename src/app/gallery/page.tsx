"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/festiv/Navbar";
import { getRitual } from "@/lib/genlayer/festivClient";
import type { RitualRequest } from "@/types/ritual";
import { Search, ArrowRight, Loader } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  approved: "#A9B8A6",
  completed: "#7C5CFF",
  generating: "#E7B95B",
  needs_revision: "#E7B95B",
  submitted: "#62D5FF",
  unsafe: "#E46F5A",
  archived: "#BFA6A0",
};

export default function GalleryPage() {
  const [ritualId, setRitualId] = useState("");
  const [searched, setSearched] = useState<RitualRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!ritualId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setSearched(null);
    try {
      const r = await getRitual(ritualId.trim());
      if (r.public_visibility) {
        setSearched(r);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="text-xs font-mono text-[#E7B95B] uppercase tracking-wide mb-3">
            Gallery
          </div>
          <h1 className="font-display text-4xl text-[#F7EFE2] mb-3">Public rituals</h1>
          <p className="text-[#BFA6A0] leading-relaxed max-w-xl mb-6">
            Browse and explore community rituals that were made public. Look up a specific ritual
            by ID, or view the demo rituals to see how Festiv works.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BFA6A0]/40" />
              <input
                type="text"
                className="w-full bg-[#121217] border border-[#4B1F35]/50 rounded-full pl-9 pr-4 py-2.5 text-[#F7EFE2] text-sm placeholder-[#BFA6A0]/40 focus:outline-none focus:border-[#7C5CFF]/60 transition-colors font-mono"
                placeholder="ritual_1, ritual_2…"
                value={ritualId}
                onChange={(e) => setRitualId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !ritualId.trim()}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white disabled:opacity-40 transition-colors"
              style={{ background: "#7C5CFF" }}
            >
              {loading ? <Loader size={14} className="animate-spin" /> : "Look up"}
            </button>
          </form>

          {notFound && (
            <p className="mt-3 text-sm text-[#E46F5A]">
              Ritual not found or not public.
            </p>
          )}
        </div>

        {searched && (
          <div
            className="rounded-2xl p-6 border mb-8"
            style={{
              borderColor: "rgba(98,213,255,0.2)",
              background: "rgba(98,213,255,0.03)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: STATUS_COLORS[searched.status] ?? "#BFA6A0",
                      color: STATUS_COLORS[searched.status] ?? "#BFA6A0",
                    }}
                  >
                    {searched.status}
                  </span>
                  <span className="text-xs text-[#BFA6A0] capitalize font-mono">
                    {searched.ritual_type?.replace(/_/g, " ")}
                  </span>
                </div>
                <h2 className="font-display text-2xl text-[#F7EFE2]">{searched.title}</h2>
                <p className="text-sm text-[#BFA6A0] mt-0.5">{searched.community_name}</p>
              </div>
              <Link
                href={`/ritual/${searched.ritual_id}`}
                className="flex items-center gap-1.5 text-xs text-[#62D5FF] hover:text-[#7C5CFF] transition-colors flex-shrink-0"
              >
                View <ArrowRight size={12} />
              </Link>
            </div>
            <p className="text-sm text-[#F7EFE2] leading-relaxed line-clamp-3">{searched.purpose}</p>
            {searched.tone_tags && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {searched.tone_tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-xs border border-[#BFA6A0]/20 text-[#BFA6A0]"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Gallery info */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            borderColor: "rgba(191,166,160,0.1)",
            background: "rgba(255,255,255,0.01)",
          }}
        >
          <h3 className="font-display text-xl text-[#F7EFE2] mb-3">About this gallery</h3>
          <p className="text-sm text-[#BFA6A0] leading-relaxed mb-4">
            For the MVP, Festiv does not index all on-chain rituals automatically. Use the search
            above to look up a specific ritual ID, or explore the demo rituals to see how the
            system works.
          </p>
          <p className="text-sm text-[#BFA6A0] leading-relaxed mb-4">
            Ritual IDs follow the format <span className="font-mono text-[#62D5FF]">ritual_1</span>,{" "}
            <span className="font-mono text-[#62D5FF]">ritual_2</span>, and so on.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-sm text-[#7C5CFF] hover:text-[#F7EFE2] transition-colors"
          >
            Explore demo rituals
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
