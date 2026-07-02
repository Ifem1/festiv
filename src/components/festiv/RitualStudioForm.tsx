"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RitualForm, RitualType } from "@/types/ritual";
import { validateRitualForm } from "@/lib/festiv/validation";
import { createRitual, getCreatorRitualIds, connectWallet, getConnectedAddress } from "@/lib/genlayer/festivClient";
import RitualTypePicker from "./RitualTypePicker";
import ToneConstellation from "./ToneConstellation";
import WalletConnectButton from "./WalletConnectButton";
import { ArrowRight, Loader } from "lucide-react";

const EMPTY_FORM: RitualForm = {
  title: "",
  ritualType: "launch",
  communityName: "",
  purpose: "",
  groupContext: "",
  participantCountBand: "",
  locationMode: "",
  durationPreference: "",
  toneTags: [],
  symbolsToInclude: "",
  symbolsToAvoid: "",
  culturalContext: "",
  accessibilityNeeds: "",
  boundaries: "",
  publicVisibility: true,
};

type Props = {
  initialValues?: Partial<RitualForm>;
};

type Stage = "form" | "submitting" | "done" | "error";

function FormCard({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6 border"
      style={{
        borderColor: "rgba(191,166,160,0.15)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <h2 className="font-display text-xl text-[#F7EFE2] mb-5">{heading}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-mono text-[#BFA6A0] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-[#E46F5A]">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full bg-[#121217] border border-[#4B1F35]/50 rounded-xl px-4 py-2.5 text-[#F7EFE2] text-sm placeholder-[#BFA6A0]/40 focus:outline-none focus:border-[#7C5CFF]/60 transition-colors";

const textareaClass = `${inputClass} resize-none`;

export default function RitualStudioForm({ initialValues }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<RitualForm>({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [stage, setStage] = useState<Stage>("form");
  const [txError, setTxError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  function set<K extends keyof RitualForm>(key: K, value: RitualForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateRitualForm(form);
    setWarnings(result.warnings);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    let from = address;
    if (!from) {
      try {
        from = await getConnectedAddress();
        if (!from) from = await connectWallet();
        setAddress(from);
      } catch (err) {
        setTxError(err instanceof Error ? err.message : "Wallet connection failed.");
        return;
      }
    }

    setStage("submitting");
    setTxError(null);

    try {
      await createRitual(form, from);
      const ids = await getCreatorRitualIds(from);
      const latestId = ids[ids.length - 1];
      if (latestId) {
        router.push(`/ritual/${latestId}`);
      } else {
        router.push("/my-rituals");
      }
    } catch (err) {
      setTxError(
        err instanceof Error ? err.message : "The transaction failed. Check wallet and network."
      );
      setStage("error");
    }
  }

  if (stage === "submitting") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <div className="relative w-16 h-16">
          <Loader className="w-16 h-16 text-[#7C5CFF] animate-spin" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl text-[#F7EFE2] mb-2">Submitting your brief</h2>
          <p className="text-[#BFA6A0] max-w-md">
            Your ritual brief is being committed to GenLayer StudioNet. Confirm the transaction in
            your wallet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {warnings.length > 0 && (
        <div className="rounded-xl p-4 border border-[#E7B95B]/30 bg-[#E7B95B]/5">
          {warnings.map((w, i) => (
            <p key={i} className="text-sm text-[#E7B95B]">
              {w}
            </p>
          ))}
        </div>
      )}

      {errors.safety && (
        <div className="rounded-xl p-4 border border-[#E46F5A]/40 bg-[#E46F5A]/5">
          <p className="text-sm text-[#E46F5A]">{errors.safety}</p>
        </div>
      )}

      {txError && stage === "error" && (
        <div className="rounded-xl p-4 border border-[#E46F5A]/40 bg-[#E46F5A]/5">
          <p className="text-sm text-[#E46F5A]">
            The transaction failed before Festiv could update the ritual. Check wallet connection,
            contract address, network, and StudioNet status.
          </p>
          <p className="text-xs text-[#BFA6A0] mt-1 font-mono">{txError}</p>
        </div>
      )}

      <FormCard heading="What moment are you creating?">
        <Field label="Ritual Title" error={errors.title}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. First Light Guild Launch"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            maxLength={120}
          />
        </Field>
        <Field label="Ritual Type" error={errors.ritualType}>
          <RitualTypePicker
            value={form.ritualType}
            onChange={(t) => set("ritualType", t as RitualType)}
            error={errors.ritualType}
          />
        </Field>
        <Field label="Community or Group Name" error={errors.communityName}>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Open Treasury DAO"
            value={form.communityName}
            onChange={(e) => set("communityName", e.target.value)}
            maxLength={120}
          />
        </Field>
      </FormCard>

      <FormCard heading="What should the group feel and remember?">
        <Field label="Purpose" error={errors.purpose}>
          <textarea
            className={textareaClass}
            rows={4}
            placeholder="Describe the moment and what you want the group to carry forward from it..."
            value={form.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            maxLength={1500}
          />
        </Field>
      </FormCard>

      <FormCard heading="Who is this for?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Group Context" error={errors.groupContext}>
            <textarea
              className={textareaClass}
              rows={3}
              placeholder="Describe your community: backgrounds, relationships, context..."
              value={form.groupContext}
              onChange={(e) => set("groupContext", e.target.value)}
              maxLength={2000}
            />
          </Field>
          <div>
            <Field label="Participant Count">
              <select
                className={inputClass}
                value={form.participantCountBand}
                onChange={(e) => set("participantCountBand", e.target.value)}
              >
                <option value="">Select range…</option>
                <option value="1-5">1 – 5 people</option>
                <option value="6-15">6 – 15 people</option>
                <option value="15-30">15 – 30 people</option>
                <option value="30-60">30 – 60 people</option>
                <option value="60-150">60 – 150 people</option>
                <option value="150+">150+ people</option>
              </select>
            </Field>
            <Field label="Location Mode" error={errors.locationMode}>
              <select
                className={inputClass}
                value={form.locationMode}
                onChange={(e) => set("locationMode", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="online">Online / remote</option>
                <option value="in-person">In-person</option>
                <option value="hybrid">Hybrid</option>
                <option value="async">Asynchronous</option>
              </select>
            </Field>
            <Field label="Duration Preference" error={errors.durationPreference}>
              <select
                className={inputClass}
                value={form.durationPreference}
                onChange={(e) => set("durationPreference", e.target.value)}
              >
                <option value="">Select…</option>
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="90 minutes">90 minutes</option>
                <option value="2 hours">2 hours</option>
              </select>
            </Field>
          </div>
        </div>
      </FormCard>

      <FormCard heading="What tone belongs here?">
        <ToneConstellation
          selected={form.toneTags}
          onChange={(tags) => set("toneTags", tags)}
          error={errors.toneTags}
        />
      </FormCard>

      <FormCard heading="What symbols belong here?">
        <Field label="Symbols to Include">
          <textarea
            className={textareaClass}
            rows={3}
            placeholder="e.g. empty seat for future contributors, shared phrase, digital candle..."
            value={form.symbolsToInclude}
            onChange={(e) => set("symbolsToInclude", e.target.value)}
            maxLength={1000}
          />
        </Field>
        <Field label="Symbols to Avoid">
          <textarea
            className={textareaClass}
            rows={2}
            placeholder="e.g. religious symbols, military language..."
            value={form.symbolsToAvoid}
            onChange={(e) => set("symbolsToAvoid", e.target.value)}
            maxLength={1000}
          />
        </Field>
        <Field label="Cultural Context">
          <textarea
            className={textareaClass}
            rows={2}
            placeholder="e.g. global internet community, mostly secular..."
            value={form.culturalContext}
            onChange={(e) => set("culturalContext", e.target.value)}
            maxLength={1500}
          />
        </Field>
      </FormCard>

      <FormCard heading="What must Festiv avoid?">
        <Field label="Boundaries" error={errors.boundaries}>
          <textarea
            className={textareaClass}
            rows={3}
            placeholder="e.g. no forced speaking, no oath of loyalty, no financial pressure..."
            value={form.boundaries}
            onChange={(e) => set("boundaries", e.target.value)}
            maxLength={1500}
          />
        </Field>
      </FormCard>

      <FormCard heading="What would make this safer and more accessible?">
        <Field label="Accessibility Needs">
          <textarea
            className={textareaClass}
            rows={3}
            placeholder="e.g. allow silent participation, camera-off option, written participation mode..."
            value={form.accessibilityNeeds}
            onChange={(e) => set("accessibilityNeeds", e.target.value)}
            maxLength={1000}
          />
        </Field>
        <div
          className="flex items-center justify-between rounded-xl px-4 py-3 mt-2 border"
          style={{ borderColor: "#4B1F35", background: "rgba(75,31,53,0.15)" }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "#F7EFE2" }}>
              {form.publicVisibility ? "Public ritual" : "Private ritual"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#BFA6A0" }}>
              {form.publicVisibility
                ? "Anyone can find this ritual by ID in the gallery"
                : "Only you can view this ritual — it won't appear in the gallery"}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.publicVisibility}
            onClick={() => set("publicVisibility", !form.publicVisibility)}
            className="relative shrink-0 w-11 h-6 rounded-full border transition-all duration-200 ml-4"
            style={{
              background: form.publicVisibility ? "#7C5CFF" : "transparent",
              borderColor: form.publicVisibility ? "#7C5CFF" : "#4B1F35",
            }}
          >
            <span
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
              style={{ transform: form.publicVisibility ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </div>
      </FormCard>

      <div className="flex items-center justify-between pt-2">
        <WalletConnectButton onConnect={setAddress} />
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #7C5CFF, #4B1F35)",
            color: "#F7EFE2",
          }}
        >
          Create Ritual Brief
          <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
