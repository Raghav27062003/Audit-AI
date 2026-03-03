"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isNew?: boolean;
}

interface NavSection {
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "New Audit", href: "/audits/new", icon: PlusCircle },
      { label: "Audit Reports", href: "/audits", icon: ClipboardList },
    ],
  },
  {
    items: [
      { label: "Compliance Center", href: "/compliance", icon: Globe },
      {
        label: "Regulatory Intelligence",
        href: "/regulatory",
        icon: Map,
        isNew: true,
      },
      {
        label: "AI Asset Discovery",
        href: "/discovery",
        icon: Search,
        isNew: true,
      },
      {
        label: "Agentic AI Governance",
        href: "/agentic",
        icon: Bot,
        isNew: true,
      },
    ],
  },
  {
    items: [
      {
        label: "Red Team Center",
        href: "/red-team",
        icon: Target,
        isNew: true,
      },
      {
        label: "Continuous Monitoring",
        href: "/monitoring",
        icon: Activity,
        isNew: true,
      },
      { label: "Risk Registry", href: "/risks", icon: AlertTriangle },
      { label: "Remediation Tracker", href: "/remediation", icon: Wrench },
      {
        label: "Incident Response",
        href: "/incidents",
        icon: Siren,
        isNew: true,
      },
      {
        label: "Vendor AI Risk",
        href: "/vendors",
        icon: Building2,
        isNew: true,
      },
    ],
  },
  {
    items: [
      {
        label: "Executive Dashboard",
        href: "/executive",
        icon: BarChart3,
        isNew: true,
      },
      {
        label: "Maturity Assessment",
        href: "/maturity",
        icon: Trophy,
        isNew: true,
      },
      {
        label: "Benchmarks",
        href: "/benchmarks",
        icon: TrendingUp,
        isNew: true,
      },
    ],
  },
  {
    items: [
      { label: "Templates", href: "/templates", icon: FileText },
      {
        label: "Integrations",
        href: "/integrations",
        icon: Plug,
        isNew: true,
      },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sidebar fixed top-0 left-0 h-screen flex flex-col z-40",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center h-16 px-4 border-b border-[rgba(139,92,246,0.1)]",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        {!collapsed && (
          <span className="gradient-accent-text text-xl font-bold tracking-tight">
            AuditAI
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navSections.map((section, sectionIdx) => (
          <div key={sectionIdx}>
            {sectionIdx > 0 && <div className="sidebar-divider" />}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn("sidebar-item", active && "active")}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="sidebar-icon" />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium truncate flex-1">
                          {item.label}
                        </span>
                        {item.isNew && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            NEW
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && (
                      <span className="sidebar-tooltip">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-[rgba(139,92,246,0.1)] p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-item w-full justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="sidebar-icon" />
          ) : (
            <>
              <ChevronLeft className="sidebar-icon" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
