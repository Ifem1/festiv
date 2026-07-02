import { ExternalLink } from "lucide-react";
import { getExplorerTxUrl, getExplorerAddressUrl } from "@/lib/genlayer/chain";

type Props = {
  type: "tx" | "address";
  value: string;
  label?: string;
  className?: string;
};

export default function ExplorerLink({ type, value, label, className = "" }: Props) {
  const url = type === "tx" ? getExplorerTxUrl(value) : getExplorerAddressUrl(value);
  const display = label ?? (type === "tx"
    ? `${value.slice(0, 8)}…${value.slice(-6)}`
    : `${value.slice(0, 6)}…${value.slice(-4)}`);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[#62D5FF] hover:text-[#7C5CFF] font-mono text-sm transition-colors ${className}`}
    >
      {display}
      <ExternalLink size={12} />
    </a>
  );
}
