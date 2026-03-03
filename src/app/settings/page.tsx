"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: <Settings className="w-4 h-4" /> },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Shield className="w-4 h-4" /> },
  ];

  const inputClass =
    "glass-input w-full px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your AuditAI platform preferences
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "general" && (
        <Card title="General Settings" icon={Settings}>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Organization Name</label>
              <input
                type="text"
                placeholder="Enter organization name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Default Framework</label>
              <select className={inputClass}>
                <option value="eu_ai_act">EU AI Act</option>
                <option value="nist_rmf">NIST RMF</option>
                <option value="iso_42001">ISO 42001</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Risk Threshold</label>
              <select className={inputClass}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Data Retention (days)</label>
              <input
                type="number"
                placeholder="365"
                className={inputClass}
              />
            </div>
            <div className="pt-4 border-t border-[rgba(139,92,246,0.1)]">
              <button className="px-6 py-2.5 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Save Changes
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "profile" && (
        <Card title="Profile Settings" icon={User}>
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-[rgba(139,92,246,0.1)]">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">Audit Administrator</p>
                <p className="text-xs text-slate-400">admin@auditai.com</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <select className={inputClass}>
                <option value="admin">Administrator</option>
                <option value="auditor">Auditor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div className="pt-4 border-t border-[rgba(139,92,246,0.1)]">
              <button className="px-6 py-2.5 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Update Profile
              </button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card title="Notification Preferences" icon={Bell}>
          <div className="space-y-4">
            {[
              { label: "New findings", description: "Get notified when new audit findings are created" },
              { label: "Overdue remediations", description: "Alerts for overdue remediation actions" },
              { label: "Risk threshold breaches", description: "When risk scores exceed set thresholds" },
              { label: "Compliance changes", description: "Updates to compliance check statuses" },
              { label: "Regulatory deadlines", description: "Upcoming regulation effective dates" },
              { label: "Escalations", description: "Approval workflow escalations" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-[rgba(139,92,246,0.04)]"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-purple-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "security" && (
        <Card title="Security Settings" icon={Shield}>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Session Timeout (minutes)</label>
              <input
                type="number"
                placeholder="30"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Two-Factor Authentication</label>
              <div className="flex items-center gap-3 mt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:bg-purple-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm text-slate-400">Enable 2FA</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value="sk-xxxxxxxxxxxxxxxxxx"
                  readOnly
                  className={inputClass}
                />
                <button className="px-4 py-2.5 rounded-lg border border-[rgba(139,92,246,0.2)] text-slate-300 text-sm font-medium hover:bg-[rgba(139,92,246,0.08)] transition-colors whitespace-nowrap">
                  Regenerate
                </button>
              </div>
            </div>
            <div className="pt-4 border-t border-[rgba(139,92,246,0.1)]">
              <button className="px-6 py-2.5 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Save Security Settings
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
