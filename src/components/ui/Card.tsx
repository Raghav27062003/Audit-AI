import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className,
  noPadding = false,
}: CardProps) {
  return (
    <div className={cn("glass-card", className)}>
      {(title || action) && (
        <div
          className={cn(
            "flex items-center justify-between",
            noPadding ? "px-6 pt-6 pb-4" : "px-6 pt-6 pb-4"
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-lg bg-[rgba(139,92,246,0.12)] flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-400" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-semibold text-slate-100">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn(!noPadding && "px-6 pb-6", !title && !noPadding && "p-6")}>
        {children}
      </div>
    </div>
  );
}
