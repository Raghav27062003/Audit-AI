"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { AlertTriangle, Shield, TrendingUp } from "lucide-react";

interface RiskRegister {
  id: number;
  title: string;
  description: string | null;
  category: string;
  likelihood: number;
  impact: number;
  riskScore: number | null;
  status: string;
  owner: string | null;
  mitigationPlan: string | null;
  createdAt: string;
}

const columns: Column<RiskRegister>[] = [
  {
    header: "Risk",
    accessor: "title",
    render: (row) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium text-slate-200">{row.title}</p>
        {row.description && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{row.description}</p>
        )}
      </div>
    ),
  },
  {
    header: "Category",
    accessor: "category",
    render: (row) => <Badge variant="purple">{row.category}</Badge>,
  },
  {
    header: "Risk Score",
    accessor: "riskScore",
    render: (row) => {
      const score = row.riskScore ?? row.likelihood * row.impact;
      return (
        <SeverityBadge
          severity={score >= 20 ? "critical" : score >= 12 ? "high" : score >= 6 ? "medium" : "low"}
        />
      );
    },
  },
  {
    header: "Likelihood",
    accessor: "likelihood",
    render: (row) => (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < row.likelihood ? "bg-purple-400" : "bg-slate-700"}`}
          />
        ))}
        <span className="text-xs text-slate-400 ml-1">{row.likelihood}/5</span>
      </div>
    ),
  },
  {
    header: "Impact",
    accessor: "impact",
    render: (row) => (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i < row.impact ? "bg-orange-400" : "bg-slate-700"}`}
          />
        ))}
        <span className="text-xs text-slate-400 ml-1">{row.impact}/5</span>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Owner",
    accessor: "owner",
    render: (row) => <span className="text-sm text-slate-400">{row.owner ?? "—"}</span>,
  },
];

export default function RisksPage() {
  const [risks, setRisks] = useState<RiskRegister[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/risk-registry")
      .then((res) => res.json())
      .then((data) => {
        setRisks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const avgScore =
    risks.length > 0
      ? Math.round(
          (risks.reduce((s, r) => s + (r.riskScore ?? r.likelihood * r.impact), 0) / risks.length) * 10
        ) / 10
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Risk Registry</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track and manage AI-related risks across your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Risks", value: risks.length, icon: AlertTriangle, color: "text-purple-400" },
          { label: "Avg Risk Score", value: avgScore, icon: TrendingUp, color: "text-yellow-400" },
          {
            label: "Critical/High",
            value: risks.filter((r) => (r.riskScore ?? r.likelihood * r.impact) >= 12).length,
            icon: Shield,
            color: "text-red-400",
          },
          {
            label: "Mitigated",
            value: risks.filter((r) => r.status === "mitigated" || r.status === "closed").length,
            icon: Shield,
            color: "text-emerald-400",
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

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="skeleton h-4 w-48 mx-auto" />
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={risks as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search risks..."
          searchableFields={["title" as keyof RiskRegister, "category" as keyof RiskRegister, "owner" as keyof RiskRegister]}
          emptyMessage="No risks registered."
        />
      )}
    </div>
  );
}
