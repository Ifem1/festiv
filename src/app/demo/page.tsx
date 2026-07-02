"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/festiv/Navbar";
import { DEMO_RITUALS } from "@/lib/festiv/demoRituals";
import { ArrowRight } from "lucide-react";

const DEMO_DESCRIPTIONS: Record<string, { headline: string; description: string }> = {
  "dao-launch": {
    headline: "A guild launch that welcomes without pledging",
    description:
      "Mark the start of a contributor guild with shared intention and no forced ceremony. Joyful, grounded, and symbolically rich.",
  },
  "conflict-reset": {
    headline: "A reset after governance friction",
    description:
      "Acknowledge a difficult dispute and recommit to better process. No blame assigned, no enemies named, no relitigating.",
  },
  memorial: {
    headline: "A quiet room for a distributed community",
    description:
      "Honour a community member who has passed. Camera-optional, silent participation welcome, culturally open.",
  },
};

export default function DemoPage() {
  const router = useRouter();

  function useAsStartingPoint(key: string) {
    const demo = DEMO_RITUALS.find((d) => d.key === key);
    if (!demo) return;
    sessionStorage.setItem("festiv-prefill", JSON.stringify(demo.data));
    router.push("/studio");
  }

  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="text-xs font-mono text-[#E46F5A] uppercase tracking-wide mb-3">
            Demo Rituals
          </div>
          <h1 className="font-display text-4xl text-[#F7EFE2] mb-3">
            See how Festiv works
          </h1>
          <p className="text-[#BFA6A0] leading-relaxed max-w-xl">
            These three examples show how different communities can use Festiv to design meaningful
            collective moments. Use any of them as a starting point for your own ritual.
          </p>
        </div>

        <div className="space-y-6">
          {DEMO_RITUALS.map((demo) => {
            const meta = DEMO_DESCRIPTIONS[demo.key];
            return (
              <div
                key={demo.key}
                className="rounded-2xl p-6 border"
                style={{
                  borderColor: "rgba(191,166,160,0.15)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="text-xs font-mono text-[#7C5CFF] uppercase tracking-wide mb-2">
                  {demo.data.ritualType.replace(/_/g, " ")}
                </div>
                <h2 className="font-display text-2xl text-[#F7EFE2] mb-1">{demo.data.title}</h2>
                {meta && (
                  <>
                    <p className="text-sm text-[#BFA6A0] font-medium mb-2">{meta.headline}</p>
                    <p className="text-sm text-[#BFA6A0]/70 leading-relaxed mb-4">
                      {meta.description}
                    </p>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="rounded-xl p-3 bg-white/2 border border-white/5">
                    <div className="text-[#BFA6A0]/60 font-mono uppercase tracking-wide mb-1">
                      Community
                    </div>
                    <div className="text-[#F7EFE2]">{demo.data.communityName}</div>
                  </div>
                  <div className="rounded-xl p-3 bg-white/2 border border-white/5">
                    <div className="text-[#BFA6A0]/60 font-mono uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="text-[#F7EFE2]">{demo.data.durationPreference}</div>
                  </div>
                  <div className="rounded-xl p-3 bg-white/2 border border-white/5">
                    <div className="text-[#BFA6A0]/60 font-mono uppercase tracking-wide mb-1">
                      Participants
                    </div>
                    <div className="text-[#F7EFE2]">{demo.data.participantCountBand}</div>
                  </div>
                  <div className="rounded-xl p-3 bg-white/2 border border-white/5">
                    <div className="text-[#BFA6A0]/60 font-mono uppercase tracking-wide mb-1">
                      Mode
                    </div>
                    <div className="text-[#F7EFE2] capitalize">{demo.data.locationMode}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-mono text-[#BFA6A0]/60 uppercase tracking-wide mb-2">
                    Tones
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {demo.data.toneTags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full text-xs border border-[#BFA6A0]/20 text-[#BFA6A0]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="text-xs font-mono text-[#BFA6A0]/60 uppercase tracking-wide mb-1">
                    Purpose
                  </div>
                  <p className="text-sm text-[#F7EFE2] leading-relaxed">{demo.data.purpose}</p>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-mono text-[#E46F5A]/60 uppercase tracking-wide mb-1">
                    Boundaries
                  </div>
                  <p className="text-sm text-[#BFA6A0]">{demo.data.boundaries}</p>
                </div>

                <button
                  onClick={() => useAsStartingPoint(demo.key)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-[#7C5CFF]/40 text-[#7C5CFF] hover:bg-[#7C5CFF]/10 transition-colors"
                >
                  Use this as a starting point
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
