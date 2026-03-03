import { cn } from "@/lib/utils";
import { statusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusLabels: Record<string, string> = {
  compliant: "Compliant",
  completed: "Completed",
  resolved: "Resolved",
  pass: "Pass",
  approved: "Approved",
  authorized: "Authorized",
  active: "Active",
  partial: "Partial",
  in_progress: "In Progress",
  review: "Review",
  provisional: "Provisional",
  monitored: "Monitored",
  non_compliant: "Non-Compliant",
  fail: "Fail",
  blocked: "Blocked",
  overdue: "Overdue",
  critical: "Critical",
  pending: "Pending",
  draft: "Draft",
  not_started: "Not Started",
  unregistered: "Unregistered",
};

function formatLabel(status: string): string {
  return (
    statusLabels[status.toLowerCase()] ||
    status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        statusColor(status),
        className
      )}
    >
      {formatLabel(status)}
    </span>
  );
}
