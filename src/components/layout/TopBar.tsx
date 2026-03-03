"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Bell, Sun, Moon, User } from "lucide-react";

export function TopBar() {
  const [darkMode, setDarkMode] = useState(true);
  const [notificationCount] = useState(3);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header className="h-16 border-b border-[rgba(139,92,246,0.1)] bg-[rgba(15,15,42,0.6)] backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <button
        onClick={openCommandPalette}
        className="glass-input flex items-center gap-3 px-4 py-2 w-full max-w-md cursor-pointer group"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-colors" />
        <span className="text-sm text-slate-500 flex-1 text-left">
          Search anything...
        </span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-slate-500 bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.15)] rounded-md">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-[rgba(139,92,246,0.08)] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-400" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full bg-purple-500 text-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[rgba(139,92,246,0.08)] transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-slate-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* User Avatar */}
        <button
          className="ml-2 flex items-center gap-2 p-1.5 rounded-lg hover:bg-[rgba(139,92,246,0.08)] transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
    </header>
  );
}
