# Festiv

**Decentralized ritual design for distributed communities — powered by GenLayer intelligent contracts.**

Festiv helps DAOs, distributed teams, cultural groups, and online communities design intentional ceremonies: launches, memorials, onboarding rituals, conflict resets, milestone celebrations, farewells, and more. A community describes the moment they want to mark — the tone, symbols, boundaries, and group context — and GenLayer validators collectively interpret that brief and converge on a structured, human-led ritual plan stored permanently on-chain.

---

## What Festiv Does

Most communities never mark their important moments. The first contributor. The end of a difficult season. The day a project shipped. Festiv makes those moments real.

You fill out a ritual brief — what you want the group to feel, who they are, what symbols belong, what must be avoided. Festiv's GenLayer contract sends that brief to multiple independent AI validators. Each validator designs a ritual from a different interpretive angle. The validators reach consensus on a plan that satisfies all safety, accessibility, and cultural care criteria. That plan is committed to GenLayer StudioNet and available to your community forever.

---

## How It Works

### 1. Create a Ritual Brief (`/studio`)

Fill in:
- **Ritual type** — launch, memorial, onboarding, conflict reset, milestone, farewell, commitment, gratitude, seasonal gathering, or custom
- **Purpose** — what moment you are marking and what you want the group to carry forward
- **Group context** — who they are: backgrounds, relationships, time zones, ages
- **Tone tags** — joyful, solemn, grounded, playful, symbolic, intimate, celebratory, contemplative
- **Symbols to include / avoid** — shared objects, phrases, gestures, digital elements
- **Cultural context** — secular, religious, pluralistic, global, regional
- **Accessibility needs** — camera-off option, written participation, silent modes
- **Boundaries** — no oaths, no financial pressure, no forced speaking
- **Visibility** — public (anyone can find by ID) or private (only you)

Submitting the brief signs a transaction via MetaMask and commits the record to GenLayer StudioNet.

### 2. Request a Ritual Plan

From your ritual detail page, click **Request GenLayer Ritual Plan**. This triggers the intelligent contract's `request_ritual_plan` method. The contract:

1. Sets the ritual status to `generating`
2. Packages the full brief as a JSON prompt
3. Calls `gl.eq_principle.prompt_non_comparative` — each of the 5 GenLayer validators independently invokes an LLM to design a ritual plan
4. Validators compare outputs against the equivalence criteria and reach consensus
5. The winning plan is stored on-chain as a structured JSON object
6. The ritual status updates to `approved`, `needs_revision`, or `unsafe`

### 3. View the Approved Plan

The ritual detail page renders the full plan: emotional intent, recommended duration, facilitator style, a sequenced 4–8 step ceremony, symbol guidance, adaptation notes, safety notes, accessibility notes, a short summary version, and a consensus envelope showing how the validators rated the brief.

### 4. Mark as Completed / Archive

Once your community has run the ceremony, mark it completed on-chain. Or archive a ritual you no longer need.

---

## GenLayer Non-Determinism

Traditional smart contracts are deterministic — the same input always produces the same output. GenLayer intelligent contracts are different: they can make LLM calls and fetch external data inside contract execution.

In Festiv, the non-determinism is intentional. A ritual brief about a DAO launch submitted today and the same brief submitted tomorrow should produce different ritual plans — because the moment is different, the validators sample from different creative angles, and no two communities are identical. GenLayer's consensus mechanism handles this by not requiring identical outputs, only *equivalent* ones.

### Equivalence Principle Used: `prompt_non_comparative`

```python
result_json = gl.eq_principle.prompt_non_comparative(
    lambda: brief_json,
    task="...",
    criteria="...",
)
```

`prompt_non_comparative` means:
- Each validator runs the full function independently and produces its own ritual plan
- A secondary LLM evaluation pass reads all validator outputs and checks each against the `criteria` string
- Outputs that satisfy the criteria are marked equivalent regardless of their exact content
- The majority-equivalent result is committed as the canonical on-chain state

The `criteria` for Festiv checks: valid JSON with all required fields, status is one of `approved/needs_revision/unsafe`, sequence has 4–8 steps with all required sub-fields, no dangerous or forced elements, `requires_human_review` is a boolean. Two validators can produce completely different ritual plans — different steps, different symbols, different phrasings — and still be considered equivalent if both pass these criteria.

This is the right equivalence principle for Festiv because ritual design is inherently subjective. There is no single correct ceremony. What matters is that the plan is structurally valid, culturally careful, and appropriate for the stated context.

---

## Architecture

```
festiv/
├── contract/
│   └── festiv.py              # GenLayer intelligent contract
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── studio/            # Ritual brief creation form
│   │   ├── my-rituals/        # Creator's ritual list
│   │   ├── ritual/[id]/       # Ritual detail + plan viewer
│   │   ├── gallery/           # Public ritual gallery
│   │   ├── demo/              # Demo rituals (no wallet needed)
│   │   └── api/gen-call/      # Server-side GenLayer read proxy
│   ├── components/festiv/
│   │   ├── RitualStudioForm   # Multi-section brief form
│   │   ├── RitualPlanRenderer # Full plan display
│   │   ├── RitualSequenceTimeline
│   │   ├── ConsensusSeal      # Validator consensus display
│   │   ├── SymbolBoundaryCard
│   │   ├── HumanAdaptationMargin
│   │   ├── ToneConstellation  # Tone tag picker
│   │   ├── RitualTypePicker
│   │   ├── WalletConnectButton
│   │   └── Navbar
│   ├── lib/
│   │   ├── genlayer/
│   │   │   └── festivClient.ts  # All GenLayer reads + writes
│   │   └── festiv/
│   │       ├── validation.ts
│   │       ├── parsePlan.ts
│   │       └── demoRituals.ts
│   └── types/
│       └── ritual.ts
```

### Tech Stack

| Layer | Technology |
|---|---|
| Intelligent contract | GenLayer Python (v0.2.20) |
| Chain | GenLayer StudioNet (chain ID 61999) |
| Contract address | `0xC253252CeAdb03A656D2785df14E18211decDB20` |
| Frontend | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet | MetaMask (injected via `window.ethereum`) |
| GenLayer SDK | `genlayer-js` |
| Reads | Server-side Next.js API route (`/api/gen-call`) |
| Writes | `genlayer-js` `writeContract` + MetaMask signing |

### Why Reads Go Through a Server-Side Proxy

Browser clients cannot call the GenLayer StudioNet RPC directly due to CORS restrictions. All `readContract` calls go through `/api/gen-call`, a Next.js API route that uses the `genlayer-js` SDK server-side. This also handles GenLayer's binary calldata encoding, which cannot be done with a plain JSON `fetch`.

### Gas Configuration

StudioNet's RPC returns `eth_gasPrice = 0`, but the chain rejects transactions with `feeCap = 0`. Festiv wraps `window.ethereum` in a provider proxy that intercepts `eth_gasPrice` (returning 10 gwei) and injects `gasPrice` into any `eth_sendTransaction` call that has a zero or missing fee before MetaMask signs it.

---

## Contract Methods

### Contract verification

Install the official GenLayer test harness with `pip install -r requirements-dev.txt`, then run direct-mode tests with `pytest tests/direct -v`. The optional StudioNet integration entry point is `gltest tests/integration -v --network studionet`.

### Write

| Method | Description |
|---|---|
| `create_ritual(title, ritual_type, community_name, purpose, group_context, participant_count_band, location_mode, duration_preference, tone_tags, symbols_to_include, symbols_to_avoid, cultural_context, accessibility_needs, boundaries, public_visibility)` | Creates a new ritual brief on-chain |
| `update_ritual_brief(ritual_id, ...)` | Updates brief fields while in `submitted` or `needs_revision` status |
| `request_ritual_plan(ritual_id)` | Triggers GenLayer validator consensus to generate a ritual plan |
| `mark_completed(ritual_id)` | Marks an approved ritual as completed after the ceremony runs |
| `archive_ritual(ritual_id)` | Archives a ritual (removes it from active view) |

### View

| Method | Description |
|---|---|
| `get_ritual(ritual_id)` | Returns the full ritual brief JSON |
| `get_ritual_plan(ritual_id)` | Returns the generated plan JSON |
| `get_creator_ritual_ids(creator_address)` | Returns comma-separated ritual IDs for a creator |
| `get_ritual_count()` | Returns total number of rituals created |

### Ritual Statuses

`submitted` → `generating` → `approved` / `needs_revision` / `unsafe` → `completed` / `archived`

---

## Running Locally

```bash
git clone https://github.com/Ifem1/festiv.git
cd festiv
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_GENLAYER_CHAIN_ID=61999
NEXT_PUBLIC_GENLAYER_RPC_URL=https://studio.genlayer.com/api
NEXT_PUBLIC_GENLAYER_EXPLORER_URL=https://explorer-studio.genlayer.com
NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS=0xC253252CeAdb03A656D2785df14E18211decDB20
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You will need:
- MetaMask (or any EIP-1193 injected wallet)
- The GenLayer StudioNet network added to MetaMask:
  - Network name: GenLayer StudioNet
  - RPC URL: `https://studio.genlayer.com/api`
  - Chain ID: `61999`
  - Currency symbol: `GEN`
- Testnet GEN tokens from the [GenLayer faucet](https://studio.genlayer.com)

---

## Deploying the Contract

The contract is deployed at `0xC253252CeAdb03A656D2785df14E18211decDB20` on GenLayer StudioNet.

To redeploy:
1. Open [GenLayer Studio](https://studio.genlayer.com)
2. Paste the contents of `contract/festiv.py`
3. Deploy
4. Update `NEXT_PUBLIC_GENLAYER_CONTRACT_ADDRESS` in `.env.local` and Vercel environment variables

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — what Festiv is and why it matters |
| `/studio` | Create a new ritual brief |
| `/my-rituals` | Your rituals (wallet required) |
| `/ritual/[id]` | Ritual detail, plan viewer, and actions |
| `/gallery` | Public ritual gallery |
| `/demo` | Explore example ritual plans without a wallet |

---

## License

MIT
