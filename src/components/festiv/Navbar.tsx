"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import WalletConnectButton from "./WalletConnectButton";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/studio", label: "Create Ritual" },
  { href: "/gallery", label: "Gallery" },
  { href: "/demo", label: "Demo Rituals" },
  { href: "/my-rituals", label: "My Rituals" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "rgba(75,31,53,0.4)",
        background: "rgba(23,17,31,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-[#E46F5A] text-xl">✦</span>
          <span className="font-display text-xl text-[#F7EFE2] tracking-wide">Festiv</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{
                color: pathname === link.href ? "#F7EFE2" : "#BFA6A0",
                borderBottom:
                  pathname === link.href ? "1px solid #E46F5A" : "1px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <WalletConnectButton />
        </div>

        <button
          className="md:hidden text-[#BFA6A0]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-5 pb-5 flex flex-col gap-4 border-t"
          style={{ borderColor: "rgba(75,31,53,0.3)" }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#BFA6A0] hover:text-[#F7EFE2] transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <WalletConnectButton />
        </div>
      )}
    </nav>
  );
}
