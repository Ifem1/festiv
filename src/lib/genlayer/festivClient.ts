"use client";

import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { RitualForm, RitualRequest, RitualPlanRecord } from "@/types/ritual";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS as `0x${string}`;

// ── Read: server-side proxy avoids CORS and browser rate-limit storms ──────────

async function genCall(functionName: string, args: unknown[], account?: string): Promise<unknown> {
  const res = await fetch("/api/gen-call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ functionName, args, account }),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  return json.result;
}

// ── Write: genlayer-js SDK signs via MetaMask ──────────────────────────────────

// StudioNet advertises eth_gasPrice=0, but rejects feeCap=0 transactions.
// genlayer-js ignores gas/gasPrice params passed to writeContract and fetches
// eth_gasPrice itself — so we intercept at the provider level instead.
const FORCED_GAS_PRICE = "0x" + BigInt(10_000_000_000).toString(16); // 10 gwei

function gasPricedProvider(provider: NonNullable<Window["ethereum"]>): NonNullable<Window["ethereum"]> {
  return {
    isMetaMask: provider.isMetaMask,
    on: provider.on.bind(provider),
    removeListener: provider.removeListener.bind(provider),
    request: async (args: { method: string; params?: unknown[] }) => {
      // Intercept eth_gasPrice so genlayer-js builds tx with non-zero fee
      if (args.method === "eth_gasPrice") {
        return FORCED_GAS_PRICE;
      }
      // Inject gasPrice into eth_sendTransaction if missing / zero
      if (args.method === "eth_sendTransaction" && Array.isArray(args.params)) {
        const tx = { ...(args.params[0] as Record<string, unknown>) };
        const currentGasPrice = tx.gasPrice as string | undefined;
        const currentMaxFee = tx.maxFeePerGas as string | undefined;
        if (!currentGasPrice || currentGasPrice === "0x0" || currentGasPrice === "0x") {
          if (!currentMaxFee || currentMaxFee === "0x0" || currentMaxFee === "0x") {
            tx.gasPrice = FORCED_GAS_PRICE;
            // Remove EIP-1559 fields so MetaMask uses legacy type
            delete tx.maxFeePerGas;
            delete tx.maxPriorityFeePerGas;
          }
        }
        return provider.request({ ...args, params: [tx, ...args.params.slice(1)] });
      }
      return provider.request(args);
    },
  };
}

function writeClient(address: `0x${string}`) {
  if (!window.ethereum) throw new Error("No injected wallet found.");
  return createClient({
    chain: studionet,
    account: address,
    provider: gasPricedProvider(window.ethereum),
  });
}

// ── Wallet ─────────────────────────────────────────────────────────────────────

export async function getConnectedAddress(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  try {
    const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[];
    return accounts[0] ?? null;
  } catch {
    return null;
  }
}

export async function connectWallet(): Promise<string> {
  if (typeof window === "undefined" || !window.ethereum)
    throw new Error("No injected wallet found. Install MetaMask.");
  const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
  if (!accounts[0]) throw new Error("No accounts returned.");
  return accounts[0];
}

// ── Writes ─────────────────────────────────────────────────────────────────────

export async function createRitual(form: RitualForm, from: string): Promise<string> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const client = writeClient(from as `0x${string}`);
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "create_ritual",
    args: [
      form.title, form.ritualType, form.communityName, form.purpose,
      form.groupContext, form.participantCountBand, form.locationMode,
      form.durationPreference, form.toneTags.join(", "),
      form.symbolsToInclude, form.symbolsToAvoid, form.culturalContext,
      form.accessibilityNeeds, form.boundaries, form.publicVisibility,
    ],
    value: BigInt(0),
  });
  // Don't wait for FINALIZED — StudioNet indexes slowly; caller refreshes for status
  return txHash as string;
}

export async function requestRitualPlan(ritualId: string, from: string): Promise<string> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const client = writeClient(from as `0x${string}`);
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "request_ritual_plan",
    args: [ritualId],
    value: BigInt(0),
  });
  return txHash as string;
}

export async function updateRitualBrief(
  ritualId: string,
  brief: Pick<RitualForm, "purpose" | "groupContext" | "toneTags" | "symbolsToInclude" | "symbolsToAvoid" | "culturalContext" | "accessibilityNeeds" | "boundaries">,
  from: string,
): Promise<string> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const client = writeClient(from as `0x${string}`);
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "update_ritual_brief",
    args: [
      ritualId, brief.purpose, brief.groupContext, brief.toneTags.join(", "),
      brief.symbolsToInclude, brief.symbolsToAvoid, brief.culturalContext,
      brief.accessibilityNeeds, brief.boundaries,
    ],
    value: BigInt(0),
  });
  return txHash as string;
}

export async function markCompleted(ritualId: string, from: string): Promise<string> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const client = writeClient(from as `0x${string}`);
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "mark_completed",
    args: [ritualId],
    value: BigInt(0),
  });
  return txHash as string;
}

export async function archiveRitual(ritualId: string, from: string): Promise<string> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const client = writeClient(from as `0x${string}`);
  const txHash = await client.writeContract({
    address: CONTRACT_ADDRESS,
    functionName: "archive_ritual",
    args: [ritualId],
    value: BigInt(0),
  });
  return txHash as string;
}

// ── Reads ──────────────────────────────────────────────────────────────────────

export async function getRitual(ritualId: string, account?: string): Promise<RitualRequest> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const raw = await genCall("get_ritual", [ritualId], account);
  if (typeof raw === "string") return JSON.parse(raw) as RitualRequest;
  return raw as RitualRequest;
}

export async function getRitualPlan(ritualId: string, account?: string): Promise<RitualPlanRecord> {
  if (!CONTRACT_ADDRESS) throw new Error("Contract address not configured.");
  const raw = await genCall("get_ritual_plan", [ritualId], account);
  if (typeof raw === "string") return JSON.parse(raw) as RitualPlanRecord;
  return raw as RitualPlanRecord;
}

export async function getCreatorRitualIds(address: string): Promise<string[]> {
  if (!CONTRACT_ADDRESS) return [];
  const raw = await genCall("get_creator_ritual_ids", [address.toLowerCase()]);
  const str = typeof raw === "string" ? raw : String(raw ?? "");
  if (!str.trim() || str === "null") return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

export async function getCreatorRitualIdsAfterTx(address: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 2000));
  return getCreatorRitualIds(address);
}
