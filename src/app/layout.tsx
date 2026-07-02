import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Festiv — Ritual Builder for Distributed Communities",
  description:
    "A decentralized ritual builder for communities that need meaningful collective moments without central authority.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
