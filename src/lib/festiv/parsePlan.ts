import type { RitualPlan } from "@/types/ritual";

export function parsePlan(planJson: string): { plan: RitualPlan | null; error: string | null; raw: string } {
  try {
    const plan = JSON.parse(planJson) as RitualPlan;
    return { plan, error: null, raw: planJson };
  } catch {
    return { plan: null, error: "Malformed plan JSON returned by validators.", raw: planJson };
  }
}
