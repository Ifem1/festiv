import type { RitualSymbol } from "@/types/ritual";
import { AlertCircle } from "lucide-react";

type Props = {
  symbols: RitualSymbol[];
};

export default function SymbolBoundaryCard({ symbols }: Props) {
  if (!symbols || symbols.length === 0) {
    return <p className="text-[#BFA6A0] text-sm">No symbols assigned.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {symbols.map((sym, idx) => (
        <div
          key={idx}
          className="rounded-xl p-4 border"
          style={{
            borderColor: "rgba(231,185,91,0.2)",
            background: "rgba(231,185,91,0.04)",
          }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-[#E7B95B] font-medium text-sm">{sym.symbol}</span>
            <span className="text-xs text-[#BFA6A0] font-mono px-1.5 py-0.5 rounded border border-[#BFA6A0]/20">
              symbol
            </span>
          </div>
          <p className="text-xs text-[#F7EFE2] mb-2 leading-relaxed">{sym.meaning}</p>
          <p className="text-xs text-[#BFA6A0] mb-2 leading-relaxed">
            <span className="text-[#A9B8A6]">Use: </span>
            {sym.use_instruction}
          </p>
          {sym.avoid_if && (
            <div className="flex items-start gap-1.5 text-xs text-[#E46F5A]">
              <AlertCircle size={11} className="mt-0.5 flex-shrink-0" />
              <span>{sym.avoid_if}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
