import { AlertTriangle, Info } from "lucide-react";

type Props = {
  adaptationNotes: string[];
  safetyNotes: string[];
  accessibilityNotes: string[];
};

export default function HumanAdaptationMargin({
  adaptationNotes,
  safetyNotes,
  accessibilityNotes,
}: Props) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        borderColor: "rgba(169,184,166,0.25)",
        background: "linear-gradient(135deg, rgba(169,184,166,0.05), transparent)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1 h-8 rounded-full"
          style={{ background: "linear-gradient(to bottom, #A9B8A6, #7C5CFF)" }}
        />
        <h3 className="font-display text-lg text-[#F7EFE2]">Leave room for humans</h3>
      </div>
      <p className="text-xs text-[#BFA6A0] mb-5 leading-relaxed">
        Festiv does not prescribe rigid culture. These notes are invitations, not instructions.
      </p>

      {adaptationNotes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-mono text-[#A9B8A6] uppercase tracking-wide mb-2">
            Adaptation Space
          </h4>
          <ul className="space-y-2">
            {adaptationNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F7EFE2]">
                <span className="text-[#A9B8A6] mt-1">◦</span>
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {safetyNotes.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-mono text-[#E46F5A] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <AlertTriangle size={10} />
            Safety Cautions
          </h4>
          <ul className="space-y-2">
            {safetyNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F7EFE2]">
                <span className="text-[#E46F5A] mt-1">◦</span>
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {accessibilityNotes.length > 0 && (
        <div>
          <h4 className="text-xs font-mono text-[#62D5FF] uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Info size={10} />
            Accessibility
          </h4>
          <ul className="space-y-2">
            {accessibilityNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#F7EFE2]">
                <span className="text-[#62D5FF] mt-1">◦</span>
                <span className="leading-relaxed">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
