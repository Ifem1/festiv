"use client";

import { useState, useEffect, useCallback } from "react";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
import { connectWallet, getConnectedAddress } from "@/lib/genlayer/festivClient";

type Props = {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
};

export default function WalletConnectButton({ onConnect, onDisconnect }: Props) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Silent check on mount — does NOT fire onConnect (avoids infinite re-render loop)
  useEffect(() => {
    getConnectedAddress().then((addr) => {
      setAddress(addr);
    });

    if (typeof window !== "undefined" && window.ethereum) {
      const handler = (accounts: unknown) => {
        const addr = Array.isArray(accounts) ? (accounts[0] as string | undefined) ?? null : null;
        setAddress(addr);
      };
      window.ethereum.on("accountsChanged", handler as (...args: unknown[]) => void);
      return () => window.ethereum?.removeListener("accountsChanged", handler as (...args: unknown[]) => void);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const addr = await connectWallet();
      setAddress(addr);
      onConnect?.(addr);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connection failed.");
    } finally {
      setLoading(false);
    }
  }

  function handleDisconnect() {
    setAddress(null);
    onDisconnect?.();
  }

  async function copyAddress() {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function shortAddress(addr: string) {
    return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={copyAddress}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border border-[#4B1F35] bg-[#17111F] text-[#BFA6A0] hover:border-[#E7B95B] hover:text-[#E7B95B] transition-colors font-mono"
          title={address}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {shortAddress(address)}
        </button>
        <button
          onClick={handleDisconnect}
          className="p-1.5 rounded-full text-[#BFA6A0] hover:text-[#E46F5A] transition-colors"
          title="Disconnect"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#7C5CFF] text-white hover:bg-[#6a4de0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Wallet size={14} />
        {loading ? "Connecting…" : "Connect Wallet"}
      </button>
      {error && <p className="text-xs text-[#E46F5A] max-w-[200px] text-right">{error}</p>}
    </div>
  );
}
