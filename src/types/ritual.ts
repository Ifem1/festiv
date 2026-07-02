export type RitualType =
  | "launch"
  | "memorial"
  | "onboarding"
  | "conflict_reset"
  | "milestone"
  | "farewell"
  | "commitment"
  | "gratitude"
  | "seasonal_gathering"
  | "custom";

export type RitualForm = {
  title: string;
  ritualType: RitualType;
  communityName: string;
  purpose: string;
  groupContext: string;
  participantCountBand: string;
  locationMode: string;
  durationPreference: string;
  toneTags: string[];
  symbolsToInclude: string;
  symbolsToAvoid: string;
  culturalContext: string;
  accessibilityNeeds: string;
  boundaries: string;
  publicVisibility: boolean;
};

export type RitualStep = {
  step: number;
  name: string;
  purpose: string;
  instructions: string;
  estimated_minutes: number;
  participant_mode: "silent" | "spoken" | "physical" | "digital" | "mixed";
};

export type RitualSymbol = {
  symbol: string;
  meaning: string;
  use_instruction: string;
  avoid_if: string;
};

export type ConsensusEnvelope = {
  status: string;
  ritual_type: string;
  dominant_tone: string;
  sensitivity_level: string;
  duration_band: string;
  facilitation_complexity: string;
  requires_human_review: boolean;
  confidence_band: string;
};

export type RitualPlan = {
  status: string;
  ritual_title: string;
  ritual_type: string;
  emotional_intent: string;
  recommended_duration_minutes: number;
  tone_summary: string;
  cultural_sensitivity_level: string;
  facilitator_style: string;
  opening_moment: string;
  sequence: RitualStep[];
  symbols: RitualSymbol[];
  adaptation_notes: string[];
  safety_notes: string[];
  accessibility_notes: string[];
  closing_moment: string;
  short_version: string;
  reasoning_summary: string;
  confidence: number;
  consensus_envelope: ConsensusEnvelope;
};

export type RitualRequest = {
  ritual_id: string;
  creator: string;
  title: string;
  ritual_type: string;
  community_name: string;
  purpose: string;
  group_context: string;
  participant_count_band: string;
  location_mode: string;
  duration_preference: string;
  tone_tags: string;
  symbols_to_include: string;
  symbols_to_avoid: string;
  cultural_context: string;
  accessibility_needs: string;
  boundaries: string;
  public_visibility: boolean;
  status: string;
  created_at: number;
  generated_at: number;
};

export type RitualPlanRecord = {
  ritual_id: string;
  status: string;
  ritual_title: string;
  ritual_type: string;
  emotional_intent: string;
  duration_minutes: number;
  tone_summary: string;
  plan_json: string;
  consensus_envelope_json: string;
  confidence_band: string;
  created_at: number;
};
