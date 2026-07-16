import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const key = process.env.FESTIV_TEST_PRIVATE_KEY;
if (!key) throw new Error("FESTIV_TEST_PRIVATE_KEY is required");

const contract = "0xc5E0b6c759E788b06A479f79beAA18Db8c8Db526";
const account = createAccount(key.startsWith("0x") ? key : `0x${key}`);
const client = createClient({ chain: studionet, account });
const stranger = createAccount();

const read = (functionName, args, caller = account) => client.readContract({
  account: caller,
  address: contract,
  functionName,
  args,
});

async function accepted(hash) {
  console.log(`tx ${hash}`);
  await client.waitForTransactionReceipt({ hash, status: "ACCEPTED", interval: 5_000, retries: 120 });
}

const before = BigInt(await read("get_ritual_count", []));
const ritualId = `ritual_${before + 1n}`;
console.log(`creator ${account.address}`);
console.log(`creating ${ritualId}`);

await accepted(await client.writeContract({
  address: contract,
  functionName: "create_ritual",
  args: [
    "First Week Welcome Circle",
    "onboarding",
    "Open Source Maintainers Collective",
    "Welcome three new remote contributors, help them understand how decisions are made, and give everyone a low-pressure way to form working relationships.",
    "A globally distributed open-source team of 18 people across Lagos, Berlin, Nairobi, São Paulo, and Toronto. The group meets on video and communicates asynchronously.",
    "10-25",
    "online",
    "30 minutes",
    "warm, grounded, inclusive",
    "a shared digital map and one meaningful desk object per participant",
    "religious symbols, national flags, competitive ranking",
    "Participants have varied cultural and religious backgrounds; avoid assuming shared traditions or requiring personal disclosure.",
    "Live captions, spoken instructions also posted in chat, camera optional, and quiet participation allowed.",
    "Everything is opt-in. Do not pressure anyone to speak, explain identity, disclose personal history, or turn on a camera.",
    false,
  ],
  value: 0n,
}));

let ritual = JSON.parse(await read("get_ritual", [ritualId]));
console.log(`created status=${ritual.status} private=${!ritual.public_visibility}`);

try {
  await read("get_ritual", [ritualId], stranger);
  throw new Error("PRIVACY FAILURE: stranger read private ritual");
} catch (error) {
  if (String(error).includes("PRIVACY FAILURE")) throw error;
  console.log("private stranger read rejected");
}

await accepted(await client.writeContract({
  address: contract,
  functionName: "update_ritual_brief",
  args: [
    ritualId,
    "Welcome three new remote contributors and end with one concrete, voluntary next-step connection for each newcomer.",
    "A globally distributed open-source team of 18 people. Two newcomers prefer written participation and one uses a screen reader.",
    "warm, calm, practical",
    "a shared digital map and optional meaningful desk object",
    "religious symbols, national flags, competitive ranking",
    "Participants have varied cultural and religious backgrounds; use culturally neutral language.",
    "Live captions, full instructions in chat, camera optional, screen-reader-friendly materials, and quiet participation.",
    "Everything is opt-in; no identity or personal-history disclosure; written responses must always be accepted.",
  ],
  value: 0n,
}));
ritual = JSON.parse(await read("get_ritual", [ritualId]));
console.log(`revised purpose=${ritual.purpose}`);

await accepted(await client.writeContract({
  address: contract,
  functionName: "request_ritual_plan",
  args: [ritualId],
  value: 0n,
}));

ritual = JSON.parse(await read("get_ritual", [ritualId]));
const plan = JSON.parse(await read("get_ritual_plan", [ritualId]));
const planJson = JSON.parse(plan.plan_json);
console.log(`generated status=${ritual.status} steps=${planJson.sequence?.length ?? 0} confidence=${plan.confidence_band}`);

if (ritual.status === "approved") {
  await accepted(await client.writeContract({ address: contract, functionName: "mark_completed", args: [ritualId], value: 0n }));
  ritual = JSON.parse(await read("get_ritual", [ritualId]));
  console.log(`final status=${ritual.status}`);
} else {
  console.log(`completion skipped because validator status is ${ritual.status}`);
}

console.log(JSON.stringify({ ritualId, creator: account.address, status: ritual.status, planStatus: plan.status }, null, 2));
