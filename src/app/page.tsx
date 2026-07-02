import Link from "next/link";
import Navbar from "@/components/festiv/Navbar";
import { ArrowRight, Shield, Users, Layers } from "lucide-react";

const RITUAL_TYPES = [
  { label: "Launch Rituals", desc: "Mark the beginning with shared intention", emoji: "✦" },
  { label: "Memorials", desc: "Honour community members with care", emoji: "◯" },
  { label: "Onboarding Ceremonies", desc: "Welcome new members into the fabric", emoji: "⊕" },
  { label: "Conflict Resets", desc: "Acknowledge friction and recommit to process", emoji: "⟳" },
  { label: "Milestones", desc: "Celebrate thresholds that matter", emoji: "◈" },
  { label: "Farewells", desc: "Close a chapter with gratitude", emoji: "↗" },
];

const EXAMPLE_CARDS = [
  {
    title: "First Light Guild Launch",
    type: "Launch",
    community: "First Light Guild",
    tones: ["joyful", "grounded", "symbolic"],
    duration: "30 min",
  },
  {
    title: "Governance Reset Circle",
    type: "Conflict Reset",
    community: "Open Treasury DAO",
    tones: ["reflective", "healing", "formal"],
    duration: "45 min",
  },
  {
    title: "Quiet Room of Remembrance",
    type: "Memorial",
    community: "Builders Circle",
    tones: ["solemn", "intimate", "secular"],
    duration: "40 min",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#17111F" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative px-5 pt-24 pb-20 max-w-4xl mx-auto text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,92,255,0.12), transparent)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#4B1F35]/60 text-xs text-[#BFA6A0] mb-8 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A9B8A6]" />
            Powered by GenLayer StudioNet
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-[#F7EFE2] leading-tight mb-6">
            Build rituals your community
            <br />
            <span style={{ color: "#E46F5A" }}>can actually gather around.</span>
          </h1>
          <p className="text-lg text-[#BFA6A0] mb-4 max-w-2xl mx-auto leading-relaxed">
            A decentralized ritual builder for communities that need meaning without central authority.
          </p>
          <p className="text-base text-[#BFA6A0]/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Festiv turns launch moments, memorials, onboarding ceremonies, conflict resets, and
            milestones into human-led rituals shaped by GenLayer consensus.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studio"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7C5CFF, #4B1F35)" }}
            >
              Create a Ritual Brief
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border border-[#4B1F35]/60 text-[#BFA6A0] hover:text-[#F7EFE2] hover:border-[#BFA6A0]/40 transition-colors"
            >
              Explore Demo Rituals
            </Link>
          </div>
        </div>
      </section>

      {/* Ritual types */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl text-[#F7EFE2] mb-2 text-center">
          Every community moment deserves structure.
        </h2>
        <p className="text-[#BFA6A0] text-center mb-10 max-w-xl mx-auto">
          Most groups either improvise badly, copy templates that do not fit, or hand the ceremony
          to one person&apos;s taste.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RITUAL_TYPES.map((rt) => (
            <div
              key={rt.label}
              className="rounded-xl p-5 border"
              style={{
                borderColor: "rgba(191,166,160,0.15)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="text-2xl mb-3 text-[#E46F5A]">{rt.emoji}</div>
              <h3 className="text-[#F7EFE2] font-medium mb-1 text-sm">{rt.label}</h3>
              <p className="text-xs text-[#BFA6A0] leading-relaxed">{rt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        className="px-5 py-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(75,31,53,0.1), transparent)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-[#F7EFE2] mb-2 text-center">
            How GenLayer consensus ritual design works
          </h2>
          <p className="text-[#BFA6A0] text-center mb-12 max-w-xl mx-auto">
            Ritual design is not deterministic. There is no single correct ceremony for grief,
            launch energy, or conflict repair.
          </p>
          <div className="space-y-6">
            {[
              {
                n: "01",
                title: "Describe the moment",
                desc: "Fill in a ritual brief: purpose, group context, tone, symbols, boundaries, and accessibility needs.",
              },
              {
                n: "02",
                title: "GenLayer validators interpret",
                desc: "Validators reason independently about tone fit, cultural sensitivity, symbolic coherence, and facilitation risk.",
              },
              {
                n: "03",
                title: "Consensus converges",
                desc: "A consensus envelope and a structured ritual plan emerge from validator agreement — not a single AI guess.",
              },
              {
                n: "04",
                title: "Humans adapt and perform",
                desc: "The plan is a starting point. Facilitators lead, communities adapt, and the ritual belongs to the people who perform it.",
              },
            ].map((step) => (
              <div key={step.n} className="flex gap-5">
                <div
                  className="text-2xl font-display font-light flex-shrink-0 w-12 text-right"
                  style={{ color: "#4B1F35" }}
                >
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[#F7EFE2] font-medium mb-1">{step.title}</h3>
                  <p className="text-sm text-[#BFA6A0] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example cards */}
      <section className="px-5 py-16 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl text-[#F7EFE2] mb-10 text-center">
          Example ritual briefs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAMPLE_CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl p-5 border"
              style={{
                borderColor: "rgba(191,166,160,0.15)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="text-xs font-mono text-[#7C5CFF] mb-2 uppercase tracking-wide">
                {c.type}
              </div>
              <h3 className="text-[#F7EFE2] font-medium mb-1">{c.title}</h3>
              <p className="text-xs text-[#BFA6A0] mb-3">{c.community}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {c.tones.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-xs border border-[#BFA6A0]/20 text-[#BFA6A0]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#BFA6A0] font-mono">{c.duration}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safety block */}
      <section className="px-5 py-16 max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-8 border"
          style={{
            borderColor: "rgba(169,184,166,0.2)",
            background: "rgba(169,184,166,0.04)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} className="text-[#A9B8A6]" />
            <h2 className="font-display text-2xl text-[#F7EFE2]">Cultural care and safety</h2>
          </div>
          <p className="text-[#BFA6A0] leading-relaxed mb-3">
            Festiv does not replace cultural leaders, therapists, elders, facilitators, or spiritual
            authorities.
          </p>
          <p className="text-[#BFA6A0] leading-relaxed">
            It helps communities prepare with more care by surfacing structure, boundaries,
            accessibility notes, and adaptation space — so the humans who lead still lead.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 text-center">
        <h2 className="font-display text-4xl text-[#F7EFE2] mb-4">
          Ready to design a ceremony?
        </h2>
        <p className="text-[#BFA6A0] mb-8 max-w-md mx-auto">
          GenLayer validators will interpret your moment and converge on a ritual structure that
          humans can adapt and perform.
        </p>
        <Link
          href="/studio"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #E46F5A, #7C5CFF)" }}
        >
          Open the Ritual Studio
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-5 py-8" style={{ borderColor: "rgba(75,31,53,0.3)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#E46F5A]">✦</span>
            <span className="font-display text-[#F7EFE2]">Festiv</span>
            <span className="text-[#BFA6A0]/50 text-xs ml-2">
              A ceremony operating system for decentralized communities
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#BFA6A0]/60 font-mono">
            <span>GenLayer StudioNet</span>
            <span>·</span>
            <Users size={11} />
            <span>Human-led</span>
            <span>·</span>
            <Layers size={11} />
            <span>Consensus design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
