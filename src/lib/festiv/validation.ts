import type { RitualForm } from "@/types/ritual";

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
  warnings: string[];
};

const UNSAFE_PATTERNS = [
  /self.harm/i,
  /suicide/i,
  /kill (myself|yourself|ourselves)/i,
  /hurt (myself|yourself|ourselves)/i,
  /violence against/i,
];

export function validateRitualForm(form: RitualForm): ValidationResult {
  const errors: Record<string, string> = {};
  const warnings: string[] = [];

  if (!form.title.trim()) errors.title = "Title is required.";
  if (!form.ritualType) errors.ritualType = "Ritual type is required.";
  if (!form.communityName.trim()) errors.communityName = "Community name is required.";
  if (!form.purpose.trim()) errors.purpose = "Purpose is required.";
  if (!form.groupContext.trim()) errors.groupContext = "Group context is required.";
  if (!form.durationPreference.trim()) errors.durationPreference = "Duration preference is required.";
  if (!form.locationMode.trim()) errors.locationMode = "Location mode is required.";
  if (form.toneTags.length === 0) errors.toneTags = "Select at least one tone.";
  if (!form.boundaries.trim()) errors.boundaries = "Boundaries are required.";

  if (form.ritualType === "conflict_reset" && !form.boundaries.trim()) {
    errors.boundaries = "Boundaries are required for conflict reset rituals.";
  }

  if (form.ritualType === "memorial" && !form.culturalContext.trim()) {
    warnings.push(
      "For memorial rituals, adding cultural context helps validators design a more appropriate ceremony."
    );
  }

  const purposeAndBoundaries = `${form.purpose} ${form.boundaries}`.toLowerCase();
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(purposeAndBoundaries)) {
      errors.safety =
        "This ritual request contains language that crosses a safety boundary. Festiv does not generate ceremonies that could endanger or harm people. Please revise your brief.";
      break;
    }
  }

  const SACRED_SYMBOLS = ["cross", "star of david", "crescent", "om", "swastika", "ankh", "pentagram"];
  const symbolsLower = form.symbolsToInclude.toLowerCase();
  const hasSacredSymbol = SACRED_SYMBOLS.some((s) => symbolsLower.includes(s));
  if (hasSacredSymbol) {
    warnings.push(
      "Your symbol list includes symbols from living spiritual traditions. Please clarify in Cultural Context that you have appropriate permission or connection to these traditions."
    );
  }

  return { valid: Object.keys(errors).length === 0, errors, warnings };
}
