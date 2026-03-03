"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { PlusCircle } from "lucide-react";

export default function NewAuditPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    systemName: "",
    systemType: "",
    organization: "",
    industry: "",
    auditor: "",
    riskLevel: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/audits");
      }
    } catch {
      // Handle error silently
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "glass-input w-full px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Create New Audit</h1>
        <p className="text-sm text-slate-400 mt-1">
          Set up a new AI system audit
        </p>
      </div>

      <Card icon={PlusCircle} title="Audit Details">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Audit Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., GPT-4 Customer Service Bot Audit"
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              placeholder="Describe the scope and objectives of this audit..."
              className={inputClass}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>System Name</label>
              <input
                type="text"
                placeholder="e.g., CustomerBot v2"
                className={inputClass}
                value={form.systemName}
                onChange={(e) =>
                  setForm({ ...form, systemName: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>System Type</label>
              <select
                className={inputClass}
                value={form.systemType}
                onChange={(e) =>
                  setForm({ ...form, systemType: e.target.value })
                }
              >
                <option value="">Select type...</option>
                <option value="llm">LLM</option>
                <option value="ml_model">ML Model</option>
                <option value="ai_agent">AI Agent</option>
                <option value="ai_saas">AI SaaS Tool</option>
                <option value="embedded_ai">Embedded AI</option>
                <option value="custom_model">Custom Model</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Organization</label>
              <input
                type="text"
                placeholder="e.g., Acme Corp"
                className={inputClass}
                value={form.organization}
                onChange={(e) =>
                  setForm({ ...form, organization: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <select
                className={inputClass}
                value={form.industry}
                onChange={(e) =>
                  setForm({ ...form, industry: e.target.value })
                }
              >
                <option value="">Select industry...</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="technology">Technology</option>
                <option value="government">Government</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Auditor</label>
              <input
                type="text"
                placeholder="e.g., Jane Smith"
                className={inputClass}
                value={form.auditor}
                onChange={(e) =>
                  setForm({ ...form, auditor: e.target.value })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Risk Level</label>
              <select
                className={inputClass}
                value={form.riskLevel}
                onChange={(e) =>
                  setForm({ ...form, riskLevel: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[rgba(139,92,246,0.1)]">
            <button
              type="submit"
              disabled={submitting || !form.title}
              className="px-6 py-2.5 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Audit"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg border border-[rgba(139,92,246,0.2)] text-slate-300 text-sm font-medium hover:bg-[rgba(139,92,246,0.08)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
