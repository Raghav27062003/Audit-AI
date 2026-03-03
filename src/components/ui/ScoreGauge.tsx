"use client";

import { useEffect, useState } from "react";
import { getScoreColor } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreGauge({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  className,
}: ScoreGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);
  const center = size / 2;

  return (
    <div className={className}>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          style={
            {
              "--gauge-offset": offset,
              "--gauge-color": color,
            } as React.CSSProperties
          }
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(139, 92, 246, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference}
            className="transition-[stroke-dashoffset] duration-[1200ms] ease-out gauge-glow"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold"
            style={{ color }}
          >
            {clampedScore}
          </span>
          {label && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
