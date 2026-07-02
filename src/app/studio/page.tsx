"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/festiv/Navbar";
import RitualStudioForm from "@/components/festiv/RitualStudioForm";
import type { RitualForm } from "@/types/ritual";

export default function StudioPage() {
  const [prefill, setPrefill] = useState<Partial<RitualForm> | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("festiv-prefill");
    if (raw) {
      try {
        setPrefill(JSON.parse(raw) as Partial<RitualForm>);
      } catch {
        // ignore
      }
      sessionStorage.removeItem("festiv-prefill");
    }
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="mb-10">
          <div className="text-xs font-mono text-[#7C5CFF] uppercase tracking-wide mb-3">
            Ritual Studio
          </div>
          <h1 className="font-display text-4xl text-[#F7EFE2] mb-3">Design a ceremony</h1>
          <p className="text-[#BFA6A0] leading-relaxed max-w-xl">
            Describe the moment your community needs to gather around. GenLayer validators will
            interpret the brief and converge on a ritual structure that humans can adapt and perform.
          </p>
          {prefill && (
            <div className="mt-4 flex items-center gap-2 text-xs text-[#A9B8A6] bg-[#A9B8A6]/10 border border-[#A9B8A6]/20 rounded-full px-3 py-1.5">
              <span>◦</span>
              Starting from demo: {prefill.title}
            </div>
          )}
        </div>
        {ready && <RitualStudioForm initialValues={prefill} />}
      </div>
    </div>
  );
}
