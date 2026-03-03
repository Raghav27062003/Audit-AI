"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { formatDate } from "@/lib/utils";
import { ClipboardList, PlusCircle } from "lucide-react";

interface Audit {
  id: number;
  title: string;
  description: string | null;
  systemName: string | null;
  systemType: string | null;
  organization: string | null;
  status: string;
  overallScore: number | null;
  riskLevel: string | null;
  auditor: string | null;
  startDate: string | null;
  completionDate: string | null;
  createdAt: string;
  _count: { findings: number; checklists: number };
}

const columns: Column<Audit>[] = [
  {
    header: "Audit",
    accessor: "title",
    render: (row) => (
      <div>
        <Link
          href={`/audits/${row.id}`}
          className="text-sm font-medium text-slate-100 hover:text-purple-400 transition-colors"
        >
          {row.title}
        </Link>
        {row.systemName && (
          <p className="text-xs text-slate-500 mt-0.5">{row.systemName}</p>
        )}
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Risk Level",
    accessor: "riskLevel",
    render: (row) =>
      row.riskLevel ? <SeverityBadge severity={row.riskLevel} /> : <span className="text-slate-500">—</span>,
  },
  {
    header: "Score",
    accessor: "overallScore",
    render: (row) =>
      row.overallScore !== null ? (
        <ScoreGauge score={row.overallScore} size={48} strokeWidth={4} />
      ) : (
        <span className="text-slate-500">—</span>
      ),
  },
  {
    header: "Findings",
    accessor: "_count.findings",
    render: (row) => (
      <span className="text-sm text-slate-300">{row._count.findings}</span>
    ),
  },
  {
    header: "Auditor",
    accessor: "auditor",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.auditor ?? "—"}</span>
    ),
  },
  {
    header: "Created",
    accessor: "createdAt",
    render: (row) => (
      <span className="text-sm text-slate-400">{formatDate(row.createdAt)}</span>
    ),
  },
];

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audits")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setAudits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Audit Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage and review AI system audits
          </p>
        </div>
        <Link
          href="/audits/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PlusCircle className="w-4 h-4" />
          New Audit
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: audits.length, color: "text-purple-400" },
          {
            label: "Active",
            value: audits.filter((a) => a.status === "in_progress" || a.status === "review").length,
            color: "text-blue-400",
          },
          {
            label: "Completed",
            value: audits.filter((a) => a.status === "completed").length,
            color: "text-emerald-400",
          },
          {
            label: "Draft",
            value: audits.filter((a) => a.status === "draft").length,
            color: "text-slate-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="glass-card p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-4 w-32" />
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={audits as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search audits..."
          searchableFields={["title" as keyof Audit, "systemName" as keyof Audit, "auditor" as keyof Audit]}
          emptyMessage="No audits found. Create your first audit to get started."
        />
      )}
    </div>
  );
}
