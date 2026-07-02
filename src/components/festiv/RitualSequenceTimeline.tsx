import type { RitualStep } from "@/types/ritual";
import { Clock, Users, Mic, Activity, Monitor, Shuffle } from "lucide-react";

type Props = {
  sequence: RitualStep[];
};

const MODE_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  silent: { icon: <Activity size={12} />, label: "Silent", color: "#BFA6A0" },
  spoken: { icon: <Mic size={12} />, label: "Spoken", color: "#62D5FF" },
  physical: { icon: <Users size={12} />, label: "Physical", color: "#E46F5A" },
  digital: { icon: <Monitor size={12} />, label: "Digital", color: "#7C5CFF" },
  mixed: { icon: <Shuffle size={12} />, label: "Mixed", color: "#E7B95B" },
};

export default function RitualSequenceTimeline({ sequence }: Props) {
  if (!sequence || sequence.length === 0) {
    return <p className="text-[#BFA6A0] text-sm">No sequence steps available.</p>;
  }

  return (
    <div className="relative">
      <div
        className="absolute left-5 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, #4B1F35, #7C5CFF30)" }}
      />
      <div className="space-y-4">
        {sequence.map((step, idx) => {
          const mode = MODE_CONFIG[step.participant_mode] ?? MODE_CONFIG.mixed;
          const isLast = idx === sequence.length - 1;
          return (
            <div key={step.step} className="relative flex gap-5">
              <div className="relative flex-shrink-0 flex flex-col items-center" style={{ width: 40 }}>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-medium border-2 z-10"
                  style={{
                    borderColor: isLast ? "#E7B95B" : "#7C5CFF",
                    background: "#17111F",
                    color: isLast ? "#E7B95B" : "#7C5CFF",
                  }}
                >
                  {step.step}
                </div>
              </div>
              <div
                className="flex-1 rounded-xl p-4 border mb-0"
                style={{
                  borderColor: "rgba(191,166,160,0.15)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-[#F7EFE2] font-medium text-sm">{step.name}</h4>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border"
                      style={{ borderColor: mode.color, color: mode.color }}
                    >
                      {mode.icon}
                      {mode.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#BFA6A0] font-mono">
                      <Clock size={10} />
                      {step.estimated_minutes}m
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#BFA6A0] mb-2 italic">{step.purpose}</p>
                <p className="text-sm text-[#F7EFE2] leading-relaxed">{step.instructions}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
