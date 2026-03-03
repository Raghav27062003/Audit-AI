import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";

export const metadata: Metadata = {
  title: "AuditAI - AI Governance & Audit Platform",
  description:
    "Enterprise-grade AI governance, risk management, and compliance audit platform. Automate AI audits, monitor compliance, and manage regulatory requirements.",
  keywords: [
    "AI governance",
    "AI audit",
    "compliance",
    "risk management",
    "regulatory",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="font-sans antialiased bg-dark-bg text-slate-100 min-h-screen"
      >
        {/* Particle background decoration */}
        <div className="particle-bg" aria-hidden="true">
          <div
            className="particle"
            style={
              {
                top: "20%",
                left: "10%",
                "--duration": "12s",
                "--delay": "0s",
              } as React.CSSProperties
            }
          />
          <div
            className="particle"
            style={
              {
                top: "60%",
                left: "80%",
                "--duration": "10s",
                "--delay": "2s",
              } as React.CSSProperties
            }
          />
          <div
            className="particle"
            style={
              {
                top: "40%",
                left: "50%",
                "--duration": "14s",
                "--delay": "4s",
              } as React.CSSProperties
            }
          />
          <div
            className="particle"
            style={
              {
                top: "80%",
                left: "30%",
                "--duration": "9s",
                "--delay": "1s",
              } as React.CSSProperties
            }
          />
          <div
            className="particle"
            style={
              {
                top: "10%",
                left: "70%",
                "--duration": "11s",
                "--delay": "3s",
              } as React.CSSProperties
            }
          />
        </div>

        {/* Main application layout */}
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen ml-[280px]">
            <TopBar />
            <main className="flex-1 p-6 overflow-y-auto">{children}</main>
          </div>
        </div>

        {/* Command palette overlay */}
        <CommandPalette />
      </body>
    </html>
  );
}
