import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function severityColor(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical": return "text-red-400";
    case "high": return "text-orange-400";
    case "medium": return "text-yellow-400";
    case "low": return "text-green-400";
    default: return "text-slate-400";
  }
}

export function severityBg(severity: string): string {
  switch (severity?.toLowerCase()) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
    default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

export function statusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case "compliant":
    case "completed":
    case "resolved":
    case "pass":
    case "approved":
    case "authorized":
    case "active":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "partial":
    case "in_progress":
    case "review":
    case "provisional":
    case "monitored":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "non_compliant":
    case "fail":
    case "blocked":
    case "overdue":
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "pending":
    case "draft":
    case "not_started":
    case "unregistered":
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function getScoreGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 to-emerald-600";
  if (score >= 60) return "from-yellow-500 to-amber-600";
  if (score >= 40) return "from-orange-500 to-orange-600";
  return "from-red-500 to-red-600";
}
