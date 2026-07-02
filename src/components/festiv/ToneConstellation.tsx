"use client";

const TONE_TAGS = [
  "solemn",
  "joyful",
  "reflective",
  "playful",
  "sacred",
  "secular",
  "formal",
  "intimate",
  "healing",
  "energising",
  "grounded",
  "minimal",
  "symbolic",
  "experimental",
  "quiet",
  "public",
];

const TONE_COLORS: Record<string, string> = {
  solemn: "#BFA6A0",
  joyful: "#E7B95B",
  reflective: "#A9B8A6",
  playful: "#E46F5A",
  sacred: "#7C5CFF",
  secular: "#62D5FF",
  formal: "#BFA6A0",
  intimate: "#E46F5A",
  healing: "#A9B8A6",
  energising: "#E7B95B",
  grounded: "#A9B8A6",
  minimal: "#BFA6A0",
  symbolic: "#7C5CFF",
  experimental: "#62D5FF",
  quiet: "#BFA6A0",
  public: "#E7B95B",
};

type Props = {
  selected: string[];
  onChange: (tags: string[]) => void;
  error?: string;
};

export default function ToneConstellation({ selected, onChange, error }: Props) {
  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TONE_TAGS.map((tag) => {
          const active = selected.includes(tag);
          const color = TONE_COLORS[tag] ?? "#BFA6A0";
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className="relative px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer"
              style={{
                borderColor: active ? color : "rgba(191,166,160,0.25)",
                color: active ? color : "#BFA6A0",
                background: active ? `${color}15` : "transparent",
                boxShadow: active ? `0 0 12px ${color}40` : "none",
              }}
            >
              {tag}
              {active && (
                <span
                  className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-[#E46F5A]">{error}</p>}
      {selected.length > 0 && (
        <p className="mt-3 text-xs text-[#BFA6A0]">
          {selected.length} tone{selected.length > 1 ? "s" : ""} selected:{" "}
          <span className="text-[#F7EFE2]">{selected.join(", ")}</span>
        </p>
      )}
    </div>
  );
}
