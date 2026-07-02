"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Code } from "lucide-react";
import type { RitualPlanRecord } from "@/types/ritual";
import { parsePlan } from "@/lib/festiv/parsePlan";
import RitualSequenceTimeline from "./RitualSequenceTimeline";
import SymbolBoundaryCard from "./SymbolBoundaryCard";
import ConsensusSeal from "./ConsensusSeal";
import HumanAdaptationMargin from "./HumanAdaptationMargin";

type Props = {
  planRecord: RitualPlanRecord;
};

export default function RitualPlanRenderer({ planRecord }: Props) {
  const [showRaw, setShowRaw] = useState(false);
  const { plan, error, raw } = parsePlan(planRecord.plan_json);

  if (planRecord.status === "unsafe") {
    return (
      <div className="rounded-2xl p-6 border border-[#E46F5A]/40 bg-[#E46F5A]/5">
        <h3 className="font-display text-xl text-[#E46F5A] mb-2">Safety Boundary Reached</h3>
        <p className="text-[#F7EFE2] leading-relaxed">
          This ritual request crosses a safety boundary. Festiv will not generate ceremonies that
          pressure, endanger, manipulate, or culturally misuse people.
        </p>
      </div>
    );
  }

  if (planRecord.status === "needs_revision") {
    return (
      <div className="rounded-2xl p-6 border border-[#E7B95B]/40 bg-[#E7B95B]/5">
        <h3 className="font-display text-xl text-[#E7B95B] mb-2">Ritual Needs Revision</h3>
        <p className="text-[#F7EFE2] leading-relaxed mb-3">
          Festiv could not safely produce a ritual from this brief yet. Add more context, clarify
          boundaries, or remove any unsafe instructions.
        </p>
        {plan?.reasoning_summary && (
          <div className="mt-4 p-4 rounded-xl bg-white/3 border border-[#E7B95B]/20">
            <p className="text-xs text-[#BFA6A0] font-mono uppercase mb-2">Validator Notes</p>
            <p className="text-sm text-[#F7EFE2]">{plan.reasoning_summary}</p>
          </div>
        )}
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="rounded-2xl p-6 border border-[#BFA6A0]/20 bg-white/2">
        <h3 className="font-display text-xl text-[#E46F5A] mb-2">Plan Parse Error</h3>
        <p className="text-[#BFA6A0] mb-4">{error}</p>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="flex items-center gap-2 text-sm text-[#62D5FF] hover:text-[#7C5CFF] transition-colors"
        >
          <Code size={14} />
          {showRaw ? "Hide" : "Show"} raw payload
        </button>
        {showRaw && (
          <pre className="mt-3 p-4 rounded-xl bg-[#121217] text-xs text-[#A9B8A6] font-mono overflow-auto max-h-64">
            {raw}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header summary */}
      <div
        className="rounded-2xl p-6 border"
        style={{
          borderColor: "rgba(169,184,166,0.25)",
          background: "radial-gradient(ellipse at top right, rgba(124,92,255,0.08), transparent 60%)",
        }}
      >
        <h2 className="font-display text-3xl text-[#F7EFE2] mb-2">{plan.ritual_title}</h2>
        <p className="text-[#BFA6A0] mb-4 leading-relaxed">{plan.emotional_intent}</p>
        <div className="flex flex-wrap gap-3 text-sm font-mono">
          <span className="text-[#A9B8A6]">{plan.recommended_duration_minutes} min</span>
          <span className="text-[#BFA6A0]/40">·</span>
          <span className="text-[#A9B8A6] capitalize">{plan.facilitator_style}</span>
          <span className="text-[#BFA6A0]/40">·</span>
          <span className="text-[#A9B8A6] capitalize">
            {plan.cultural_sensitivity_level} sensitivity
          </span>
        </div>
      </div>

      {/* Tone summary */}
      <div>
        <h3 className="font-mono text-xs text-[#BFA6A0] uppercase tracking-wide mb-2">
          Tone Summary
        </h3>
        <p className="text-[#F7EFE2] leading-relaxed">{plan.tone_summary}</p>
      </div>

      {/* Opening moment */}
      <div
        className="rounded-xl p-5 border-l-2"
        style={{ borderLeftColor: "#E7B95B", background: "rgba(231,185,91,0.04)" }}
      >
        <h3 className="font-mono text-xs text-[#E7B95B] uppercase tracking-wide mb-2">
          Opening Moment
        </h3>
        <p className="text-[#F7EFE2] leading-relaxed">{plan.opening_moment}</p>
      </div>

      {/* Ceremony Timeline */}
      <div>
        <h3 className="font-display text-xl text-[#F7EFE2] mb-4">Ceremony Sequence</h3>
        <RitualSequenceTimeline sequence={plan.sequence} />
      </div>

      {/* Symbols */}
      {plan.symbols && plan.symbols.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-[#F7EFE2] mb-4">Symbols</h3>
          <SymbolBoundaryCard symbols={plan.symbols} />
        </div>
      )}

      {/* Closing moment */}
      <div
        className="rounded-xl p-5 border-l-2"
        style={{ borderLeftColor: "#7C5CFF", background: "rgba(124,92,255,0.05)" }}
      >
        <h3 className="font-mono text-xs text-[#7C5CFF] uppercase tracking-wide mb-2">
          Closing Moment
        </h3>
        <p className="text-[#F7EFE2] leading-relaxed">{plan.closing_moment}</p>
      </div>

      {/* Short version */}
      <div
        className="rounded-xl p-5 border"
        style={{
          borderColor: "rgba(98,213,255,0.2)",
          background: "rgba(98,213,255,0.04)",
        }}
      >
        <h3 className="font-mono text-xs text-[#62D5FF] uppercase tracking-wide mb-2">
          Short Version
        </h3>
        <p className="text-[#F7EFE2] leading-relaxed">{plan.short_version}</p>
      </div>

      {/* Human adaptation margin */}
      <HumanAdaptationMargin
        adaptationNotes={plan.adaptation_notes ?? []}
        safetyNotes={plan.safety_notes ?? []}
        accessibilityNotes={plan.accessibility_notes ?? []}
      />

      {/* Consensus Seal */}
      {plan.consensus_envelope && (
        <div>
          <h3 className="font-display text-xl text-[#F7EFE2] mb-4">Consensus Seal</h3>
          <ConsensusSeal envelope={plan.consensus_envelope} />
        </div>
      )}

      {/* Reasoning */}
      {plan.reasoning_summary && (
        <details className="group">
          <summary className="flex items-center gap-2 cursor-pointer text-sm text-[#BFA6A0] hover:text-[#F7EFE2] transition-colors list-none">
            <ChevronDown size={14} className="group-open:hidden" />
            <ChevronUp size={14} className="hidden group-open:block" />
            Validator reasoning
          </summary>
          <div className="mt-3 p-4 rounded-xl bg-[#121217] border border-[#BFA6A0]/10">
            <p className="text-sm text-[#BFA6A0] leading-relaxed">{plan.reasoning_summary}</p>
          </div>
        </details>
      )}

      {/* Raw JSON toggle */}
      <button
        onClick={() => setShowRaw(!showRaw)}
        className="flex items-center gap-2 text-xs text-[#BFA6A0]/60 hover:text-[#BFA6A0] transition-colors"
      >
        <Code size={12} />
        {showRaw ? "Hide" : "Show"} raw plan payload
      </button>
      {showRaw && (
        <pre className="p-4 rounded-xl bg-[#121217] text-xs text-[#A9B8A6] font-mono overflow-auto max-h-96">
          {raw}
        </pre>
      )}
    </div>
  );
}
