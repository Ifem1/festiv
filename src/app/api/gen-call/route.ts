import { NextRequest, NextResponse } from "next/server";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS as `0x${string}`;

export async function POST(req: NextRequest) {
  try {
    const { functionName, args } = await req.json() as {
      functionName: string;
      args: unknown[];
    };

    const client = createClient({ chain: studionet });

    const result = await client.readContract({
      address: CONTRACT_ADDRESS,
      functionName,
      args,
      stateStatus: "accepted",
    });

    return NextResponse.json({ result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "gen_call error";
    console.error("[gen-call] error:", message);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
