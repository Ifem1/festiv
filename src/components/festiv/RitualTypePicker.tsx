"use client";

import type { RitualType } from "@/types/ritual";

const RITUAL_TYPES: { value: RitualType; label: string; description: string; emoji: string }[] = [
  { value: "launch", label: "Launch", description: "Celebrate a beginning with intention", emoji: "✦" },
  { value: "memorial", label: "Memorial", description: "Honour someone who has passed", emoji: "◯" },
  { value: "onboarding", label: "Onboarding", description: "Welcome new members into the community", emoji: "⊕" },
  { value: "conflict_reset", label: "Conflict Reset", description: "Acknowledge friction and recommit to process", emoji: "⟳" },
  { value: "milestone", label: "Milestone", description: "Mark a significant achievement or threshold", emoji: "◈" },
  { value: "farewell", label: "Farewell", description: "Close a chapter with care and gratitude", emoji: "↗" },
  { value: "commitment", label: "Commitment", description: "Formalise shared intentions and values", emoji: "⬡" },
  { value: "gratitude", label: "Gratitude", description: "Acknowledge contributions and effort", emoji: "◇" },
  { value: "seasonal_gathering", label: "Seasonal Gathering", description: "Mark a cycle, season, or annual moment", emoji: "⌘" },
  { value: "custom", label: "Custom", description: "Design your own ritual category", emoji: "∿" },
];

type Props = {
  value: RitualType | "";
  onChange: (type: RitualType) => void;
  error?: string;
};

export default function RitualTypePicker({ value, onChange, error }: Props) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {RITUAL_TYPES.map((rt) => {
          const active = value === rt.value;
          return (
            <button
              key={rt.value}
              type="button"
              onClick={() => onChange(rt.value)}
              className="p-3 rounded-xl border text-left transition-all duration-200 group"
              style={{
                borderColor: active ? "#7C5CFF" : "rgba(191,166,160,0.2)",
                background: active ? "rgba(124,92,255,0.1)" : "rgba(255,255,255,0.02)",
                boxShadow: active ? "0 0 16px rgba(124,92,255,0.2)" : "none",
              }}
            >
              <div
                className="text-lg mb-1"
                style={{ color: active ? "#7C5CFF" : "#BFA6A0" }}
              >
                {rt.emoji}
              </div>
              <div
                className="text-sm font-medium mb-0.5"
                style={{ color: active ? "#F7EFE2" : "#BFA6A0" }}
              >
                {rt.label}
              </div>
              <div className="text-xs text-[#BFA6A0] leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
                {rt.description}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-[#E46F5A]">{error}</p>}
    </div>
  );
}
