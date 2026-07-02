import type { RitualForm } from "@/types/ritual";

export const daoLaunchDemo: RitualForm = {
  title: "First Light Guild Launch",
  ritualType: "launch",
  communityName: "First Light Guild",
  purpose:
    "We are launching a new contributor guild and want members to feel welcomed, responsible, and excited without making the moment too corporate.",
  groupContext:
    "The group is a distributed DAO with early contributors across different countries. Some people are technical, some are community contributors, and some are joining for the first time.",
  participantCountBand: "15-30",
  locationMode: "online",
  durationPreference: "30 minutes",
  toneTags: ["joyful", "grounded", "symbolic", "public"],
  symbolsToInclude:
    "empty seat for future contributors, shared phrase, digital candle, first commit message",
  symbolsToAvoid: "religious symbols, military language, cult-like pledges",
  culturalContext: "global internet community, mostly secular",
  accessibilityNeeds: "allow silent participation and camera-off participation",
  boundaries: "no forced speaking, no oath of loyalty, no financial pressure",
  publicVisibility: true,
};

export const conflictResetDemo: RitualForm = {
  title: "Governance Reset Circle",
  ritualType: "conflict_reset",
  communityName: "Open Treasury DAO",
  purpose:
    "The community had a difficult governance dispute. We want a structured reset ritual that acknowledges friction and recommits to better process without assigning blame.",
  groupContext:
    "Members are tired after weeks of disagreement. Some people want closure, some want accountability, and some just want a safer way to continue working together.",
  participantCountBand: "30-60",
  locationMode: "online",
  durationPreference: "45 minutes",
  toneTags: ["reflective", "healing", "formal", "grounded"],
  symbolsToInclude: "shared process document, pause gesture, reset phrase",
  symbolsToAvoid: "trial language, public confession, blame symbols",
  culturalContext: "international DAO, secular, high context conflict",
  accessibilityNeeds: "people can participate through chat or silent reflection",
  boundaries: "no forced apologies, no naming enemies, no relitigating the dispute",
  publicVisibility: false,
};

export const memorialDemo: RitualForm = {
  title: "Quiet Room of Remembrance",
  ritualType: "memorial",
  communityName: "Builders Circle",
  purpose:
    "We want to honour a community member who passed away. The group is distributed and culturally mixed. We need a quiet secular ritual that allows remembrance without forcing people to speak.",
  groupContext:
    "The person contributed to the community for years. Members are grieving in different ways and across different cultures.",
  participantCountBand: "20-50",
  locationMode: "online",
  durationPreference: "40 minutes",
  toneTags: ["solemn", "intimate", "secular", "quiet"],
  symbolsToInclude: "shared memory board, one minute of silence, empty chair",
  symbolsToAvoid: "religious assumptions, claims of closure, dramatic performance",
  culturalContext: "multi-cultural and mostly secular",
  accessibilityNeeds: "camera optional, no forced speaking, written memory option",
  boundaries: "no spiritual claims, no pressure to share grief publicly",
  publicVisibility: false,
};

export const DEMO_RITUALS = [
  { key: "dao-launch", label: "DAO Launch Ritual", data: daoLaunchDemo },
  { key: "conflict-reset", label: "Conflict Reset Ritual", data: conflictResetDemo },
  { key: "memorial", label: "Distributed Memorial", data: memorialDemo },
];
