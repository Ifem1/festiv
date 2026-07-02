import type { ConsensusEnvelope } from "@/types/ritual";
import { AlertTriangle, CheckCircle } from "lucide-react";

type Props = {
  envelope: ConsensusEnvelope;
};

const STATUS_COLORS: Record<string, string> = {
  approved: "#A9B8A6",
  needs_revision: "#E7B95B",
  unsafe: "#E46F5A",
  insufficient_context: "#BFA6A0",
};

const SENSITIVITY_COLORS: Record<string, string> = {
  low: "#A9B8A6",
  normal: "#62D5FF",
  high: "#E7B95B",
  critical: "#E46F5A",
};

export default function ConsensusSeal({ envelope }: Props) {
  const statusColor = STATUS_COLORS[envelope.status] ?? "#BFA6A0";
  const sensitivityColor = SENSITIVITY_COLORS[envelope.sensitivity_level] ?? "#BFA6A0";

  return (
    <div
      className="relative rounded-2xl p-6 border"
      style={{
        borderColor: statusColor,
        background: `radial-gradient(ellipse at top left, ${statusColor}10, transparent 60%)`,
      }}
    >
      <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-xs font-mono font-medium border"
        style={{ borderColor: statusColor, color: statusColor, background: "#17111F" }}
      >
        CONSENSUS SEAL
      </div>

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {envelope.status === "approved" ? (
              <CheckCircle size={16} style={{ color: statusColor }} />
            ) : (
              <AlertTriangle size={16} style={{ color: statusColor }} />
            )}
            <span
              className="font-mono text-sm font-medium uppercase tracking-wide"
              style={{ color: statusColor }}
            >
              {envelope.status.replace(/_/g, " ")}
            </span>
          </div>
        </div>
        {envelope.requires_human_review && (
          <div className="flex items-center gap-1.5 text-xs text-[#E7B95B] border border-[#E7B95B] rounded-full px-2.5 py-1">
            <AlertTriangle size={10} />
            Human review required
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Ritual Type", value: envelope.ritual_type?.replace(/_/g, " ") },
          { label: "Dominant Tone", value: envelope.dominant_tone },
          {
            label: "Sensitivity",
            value: envelope.sensitivity_level,
            color: sensitivityColor,
          },
          { label: "Duration Band", value: envelope.duration_band },
          { label: "Facilitation", value: envelope.facilitation_complexity },
          { label: "Confidence", value: envelope.confidence_band },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/3 rounded-lg p-3">
            <div className="text-xs text-[#BFA6A0] mb-1 uppercase tracking-wide font-mono">
              {label}
            </div>
            <div
              className="text-sm font-mono font-medium capitalize"
              style={{ color: color ?? "#F7EFE2" }}
            >
              {value ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
