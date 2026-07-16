# More Information Requested

Response to Joaquin's review request from July 13, 2026:

> Please enforce creator-only reads for private rituals, add the missing brief-revision path, and pin a resolvable SDK dependency with tests showing the full lifecycle works.

## Resolution

All requested items have been implemented, deployed, and verified against GenLayer StudioNet with two independently funded test accounts.

### Creator-only private reads

- `get_ritual` now rejects callers other than the creator when `public_visibility` is false.
- `get_ritual_plan` applies the same creator-only rule to generated plans.
- Public rituals and plans remain readable by other accounts.
- The production read proxy forwards the connected caller address through the GenLayer client so contract authorization uses the correct sender.

### Brief revision path

- The frontend SDK now exposes `updateRitualBrief`.
- The ritual detail page provides a creator-only revision form while a ritual is `submitted` or `needs_revision`.
- Revised briefs can be submitted again for validator generation.

### Resolvable SDK dependency and tests

- `genlayer-js` is pinned exactly to `1.1.8` in `package.json` and `package-lock.json`.
- Official `genlayer-test` direct-mode tests cover private and public reads and the create, revise, generate, and complete lifecycle; an opt-in `gltest` StudioNet integration entry point is included for consensus/network runs.
- `scripts/e2e-studionet.mjs` provides a repeatable live StudioNet lifecycle test without embedding a private key.
- The Next.js production build passes and the corrected application has been deployed to Vercel.

## Deployment addresses

| Resource | Address |
| --- | --- |
| GenLayer StudioNet contract | `0xc5E0b6c759E788b06A479f79beAA18Db8c8Db526` |
| Production application | https://festiv-smoky.vercel.app |
| First test creator | `0xA49c51d759790116D451f256654dD9F0549D341F` |
| Second test creator | `0x5Bf2926e49d5896C975B03fee2FDA5e96Cb4dD04` |

Private keys are intentionally excluded. The test accounts must not be used for real assets.

## Live lifecycle verification

### Lifecycle 1: `ritual_1`

| Operation | Transaction |
| --- | --- |
| Create private ritual | `0xdabd2fd5ec8a5227ac143e45eb7ed05a058481ae1b0ae5cd6ab053360a769aae` |
| Revise brief | `0xcd3603ecb76dff588b34e1112feebe582b8e1d5fb244e4755575c974d5c84818` |
| Generate plan | `0x53f63ef4c1e40dc889529062b61aa7775cbbb9721f31d4accb96dd10f791c232` |
| Mark completed | `0xc2006c88fadf3187e4802799a27aefff661108e0cde0d9658fb4fafe85f06f68` |

Results:

- Creator private read succeeded.
- Unrelated-account private read was rejected.
- Revision was persisted accurately.
- Validator plan was approved with 8 steps and high confidence.
- Final contract status was `completed`.
- Production API returned the creator's brief and plan and rejected the unrelated caller.

### Lifecycle 2: `ritual_2`

| Operation | Transaction |
| --- | --- |
| Create private ritual | `0xecf23f240cef1719f9d46f2a25234a8da79ffbf9169495860eac169dd56169` |
| Revise brief | `0x3a7adb3a10b2cf698add31ed67fcfa0e359e684970672a78e965bf1d50adb894` |
| Generate plan | `0x81d0197a7bee56cf95078419ee7e8b5d9209d3027f27411dc973e2364ea514d4` |
| Mark completed | `0xcd04d8b1e4bd6d314b04327be62641c617439a4ce1f7cfcfdc63c80f1ef0e34f` |

Results:

- Creator private read returned HTTP 200 through the production API.
- Unrelated-account private read was rejected.
- Revision was persisted accurately.
- Validator plan was approved with 7 steps and high confidence.
- Final contract status was `completed`.
- Production plan read returned HTTP 200 with the correct ritual ID and status.

## Final status

The contract, frontend SDK, revision interface, production read proxy, dependency lock, tests, Vercel configuration, and production deployment are aligned with the new contract. The requested behavior has been reproduced successfully with two different creators.
