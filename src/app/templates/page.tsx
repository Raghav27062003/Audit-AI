"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { FileText, Download, Star } from "lucide-react";

interface Template {
  id: number;
  name: string;
  description: string | null;
  category: string;
  framework: string | null;
  isDefault: boolean;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  audit: "Audit",
  checklist: "Checklist",
  compliance: "Compliance",
  report: "Report",
  questionnaire: "Questionnaire",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "all", label: "All" },
    { id: "audit", label: "Audit" },
    { id: "checklist", label: "Checklist" },
    { id: "compliance", label: "Compliance" },
    { id: "report", label: "Report" },
    { id: "questionnaire", label: "Questionnaire" },
  ];

  const filtered =
    activeTab === "all"
      ? templates
      : templates.filter((t) => t.category === activeTab);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Templates</h1>
          <p className="text-sm text-slate-400 mt-1">Pre-built templates for audits and compliance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-4 w-32 mb-3" />
              <div className="skeleton h-3 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Templates</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pre-built templates for audits, checklists, and compliance
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <FileText className="w-4 h-4" />
          Create Template
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="glass-card p-5 hover:border-[rgba(139,92,246,0.3)] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.12)] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                {template.isDefault && (
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1">
                {template.name}
              </h3>
              {template.description && (
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="purple">
                  {categoryLabels[template.category] ?? template.category}
                </Badge>
                {template.framework && (
                  <Badge variant="info">
                    {template.framework.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
