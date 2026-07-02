import { NextRequest, NextResponse } from "next/server";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS as `0x${string}`;

export async function POST(req: NextRequest) {
  try {
    const { functionName, args } = await req.json() as {
      functionName: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      args: any[];
    };

    const client = createClient({ chain: studionet });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const readOptions: any = { address: CONTRACT_ADDRESS, functionName, args, stateStatus: "accepted" };
    const result = await client.readContract(readOptions);

    return NextResponse.json({ result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "gen_call error";
    console.error("[gen-call] error:", message);
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
