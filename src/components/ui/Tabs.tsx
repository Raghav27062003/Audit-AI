"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  const [internalActive, setInternalActive] = useState(tabs[0]?.id ?? "");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTab = activeTab ?? internalActive;

  const handleTabChange = (tabId: string) => {
    if (!activeTab) {
      setInternalActive(tabId);
    }
    onChange?.(tabId);
  };

  // Update indicator position
  useEffect(() => {
    const el = tabRefs.current.get(currentTab);
    if (el && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = el.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }
  }, [currentTab]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex border-b border-[rgba(139,92,246,0.1)]", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.id, el);
          }}
          onClick={() => handleTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
            currentTab === tab.id
              ? "text-slate-100"
              : "text-slate-400 hover:text-slate-300"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
      {/* Animated indicator */}
      <div
        className="tab-indicator"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  );
}
