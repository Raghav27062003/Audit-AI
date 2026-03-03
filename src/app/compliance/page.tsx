"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Tabs } from "@/components/ui/Tabs";
import { formatDate } from "@/lib/utils";
import { Globe, Shield, FileCheck } from "lucide-react";

interface ComplianceCheck {
  id: number;
  auditId: number;
  framework: string;
  requirement: string;
  description: string | null;
  status: string;
  evidence: string | null;
  jurisdiction: string | null;
  createdAt: string;
  audit: { id: number; title: string };
}

const columns: Column<ComplianceCheck>[] = [
  {
    header: "Requirement",
    accessor: "requirement",
    render: (row) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium text-slate-200 truncate">
          {row.requirement}
        </p>
        {row.description && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {row.description}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Framework",
    accessor: "framework",
    render: (row) => (
      <span className="px-2 py-1 text-xs font-medium rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
        {row.framework.replace(/_/g, " ").toUpperCase()}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Audit",
    accessor: "audit.title",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.audit?.title ?? "—"}</span>
    ),
  },
  {
    header: "Jurisdiction",
    accessor: "jurisdiction",
    render: (row) => (
      <span className="text-sm text-slate-400">
        {row.jurisdiction ?? "Global"}
      </span>
    ),
  },
  {
    header: "Date",
    accessor: "createdAt",
    render: (row) => (
      <span className="text-sm text-slate-400">{formatDate(row.createdAt)}</span>
    ),
  },
];

const frameworkTabs = [
  { id: "all", label: "All Frameworks" },
  { id: "eu_ai_act", label: "EU AI Act" },
  { id: "nist_rmf", label: "NIST RMF" },
  { id: "iso_42001", label: "ISO 42001" },
];

export default function CompliancePage() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/compliance")
      .then((res) => res.json())
      .then((data) => {
        setChecks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    activeTab === "all"
      ? checks
      : checks.filter((c) => c.framework === activeTab);

  const compliant = checks.filter((c) => c.status === "compliant").length;
  const rate = checks.length > 0 ? Math.round((compliant / checks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Compliance Center</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track compliance across regulatory frameworks
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="flex items-center justify-center py-4">
          <ScoreGauge score={rate} size={120} strokeWidth={8} label="Compliance" />
        </Card>
        {[
          { label: "Total Checks", value: checks.length, icon: FileCheck, color: "text-purple-400" },
          { label: "Compliant", value: compliant, icon: Shield, color: "text-emerald-400" },
          {
            label: "Non-Compliant",
            value: checks.filter((c) => c.status === "non_compliant").length,
            icon: Globe,
            color: "text-red-400",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</span>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Framework Tabs */}
      <Tabs tabs={frameworkTabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="skeleton h-4 w-48 mx-auto" />
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search compliance checks..."
          searchableFields={["requirement" as keyof ComplianceCheck, "framework" as keyof ComplianceCheck]}
          emptyMessage="No compliance checks found."
        />
      )}
    </div>
  );
}
