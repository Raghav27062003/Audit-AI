"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { formatDate } from "@/lib/utils";
import { Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Remediation {
  id: number;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  assignee: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  audit: { id: number; title: string } | null;
  finding: { id: number; title: string; severity: string } | null;
}

const columns: Column<Remediation>[] = [
  {
    header: "Remediation",
    accessor: "title",
    render: (row) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium text-slate-200">{row.title}</p>
        {row.finding && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            Finding: {row.finding.title}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Priority",
    accessor: "priority",
    render: (row) => <SeverityBadge severity={row.priority} />,
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Assignee",
    accessor: "assignee",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.assignee ?? "Unassigned"}</span>
    ),
  },
  {
    header: "Due Date",
    accessor: "dueDate",
    render: (row) => {
      if (!row.dueDate) return <span className="text-slate-500">—</span>;
      const isOverdue = new Date(row.dueDate) < new Date() && row.status !== "completed" && row.status !== "verified";
      return (
        <span className={`text-sm ${isOverdue ? "text-red-400 font-medium" : "text-slate-400"}`}>
          {formatDate(row.dueDate)}
          {isOverdue && " (overdue)"}
        </span>
      );
    },
  },
  {
    header: "Audit",
    accessor: "audit.title",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.audit?.title ?? "—"}</span>
    ),
  },
];

export default function RemediationPage() {
  const [remediations, setRemediations] = useState<Remediation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/remediations")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setRemediations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const overdue = remediations.filter(
    (r) => r.dueDate && new Date(r.dueDate) < new Date() && r.status !== "completed" && r.status !== "verified"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Remediation Tracker</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track and manage remediation actions for audit findings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Actions", value: remediations.length, icon: Wrench, color: "text-purple-400" },
          {
            label: "In Progress",
            value: remediations.filter((r) => r.status === "in_progress").length,
            icon: Clock,
            color: "text-blue-400",
          },
          { label: "Overdue", value: overdue, icon: AlertTriangle, color: "text-red-400" },
          {
            label: "Completed",
            value: remediations.filter((r) => r.status === "completed" || r.status === "verified").length,
            icon: CheckCircle,
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
          data={remediations as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search remediations..."
          searchableFields={["title" as keyof Remediation, "assignee" as keyof Remediation]}
          emptyMessage="No remediation actions found."
        />
      )}
    </div>
  );
}
