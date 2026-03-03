import { cn } from "@/lib/utils";
import { severityBg } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

function formatSeverity(severity: string): string {
  return severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border",
        severityBg(severity),
        className
      )}
    >
      {formatSeverity(severity)}
    </span>
  );
}
