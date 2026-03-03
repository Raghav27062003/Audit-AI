"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Globe,
  Map,
  Search,
  Bot,
  Target,
  Activity,
  AlertTriangle,
  Wrench,
  Siren,
  Building2,
  BarChart3,
  Trophy,
  TrendingUp,
  FileText,
  Plug,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface CommandItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const commands: CommandItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "New Audit", href: "/audits/new", icon: PlusCircle },
  { label: "Audit Reports", href: "/audits", icon: ClipboardList },
  { label: "Compliance Center", href: "/compliance", icon: Globe },
  { label: "Regulatory Intelligence", href: "/regulatory", icon: Map },
  { label: "AI Asset Discovery", href: "/discovery", icon: Search },
  { label: "Agentic AI Governance", href: "/agentic", icon: Bot },
  { label: "Red Team Center", href: "/red-team", icon: Target },
  { label: "Continuous Monitoring", href: "/monitoring", icon: Activity },
  { label: "Risk Registry", href: "/risks", icon: AlertTriangle },
  { label: "Remediation Tracker", href: "/remediation", icon: Wrench },
  { label: "Incident Response", href: "/incidents", icon: Siren },
  { label: "Vendor AI Risk", href: "/vendors", icon: Building2 },
  { label: "Executive Dashboard", href: "/executive", icon: BarChart3 },
  { label: "Maturity Assessment", href: "/maturity", icon: Trophy },
  { label: "Benchmarks", href: "/benchmarks", icon: TrendingUp },
  { label: "Templates", href: "/templates", icon: FileText },
  { label: "Integrations", href: "/integrations", icon: Plug },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      handleClose();
    },
    [router, handleClose]
  );

  // Listen for Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };

    const handleCustomOpen = () => handleOpen();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [open, handleOpen, handleClose]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(
        '[data-active="true"]'
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        navigate(filtered[activeIndex].href);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="command-overlay animate-fade-in" onClick={handleClose}>
      <div
        className="command-palette animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="command-input"
          placeholder="Search commands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto py-2"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-500">
              No commands found
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <div
                  key={cmd.href}
                  role="option"
                  aria-selected={idx === activeIndex}
                  data-active={idx === activeIndex}
                  className="command-item"
                  onClick={() => navigate(cmd.href)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{cmd.label}</span>
                </div>
              );
            })
          )}
        </div>
        <div className="px-5 py-3 border-t border-[rgba(139,92,246,0.1)] flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] rounded text-[10px]">
              &uarr;&darr;
            </kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] rounded text-[10px]">
              Enter
            </kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] rounded text-[10px]">
              Esc
            </kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
