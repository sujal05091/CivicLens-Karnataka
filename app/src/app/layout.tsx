import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import BottomNav from "@/components/BottomNav";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "CivicLens Karnataka Web Platform",
  description: "Citizen-first civic technology layer connecting visual evidence to public assets, projects, maintenance, and authorities.",
  keywords: ["civic", "karnataka", "bengaluru", "pothole", "infrastructure", "civic technology"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0047AB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)] antialiased flex flex-col">
        {/* Desktop Header (72px) */}
        <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--color-outline-variant)] shadow-sm">
          <HeaderNav />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>

        {/* Desktop Footer */}
        <footer className="hidden md:block bg-white border-t border-[var(--color-outline-variant)] py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-8 flex items-center justify-between text-xs text-[var(--color-text-tertiary)]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-civic-blue)]" />
              <span>CivicLens Karnataka — Independent Citizen Prototype</span>
            </div>
            <p>Government routing, civic asset records, and updates are simulated for demonstration.</p>
          </div>
        </footer>

        {/* Mobile Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
