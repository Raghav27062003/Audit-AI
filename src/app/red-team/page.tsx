"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Target, Zap, ShieldAlert, CheckCircle } from "lucide-react";

interface RedTeamTest {
  id: number;
  auditId: number | null;
  assetId: number | null;
  testCategory: string;
  testName: string;
  testDescription: string | null;
  passFail: string;
  severity: string | null;
  runDate: string;
  runBy: string | null;
}

const columns: Column<RedTeamTest>[] = [
  {
    header: "Test",
    accessor: "testName",
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-slate-200">{row.testName}</p>
        {row.testDescription && (
          <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
            {row.testDescription}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Category",
    accessor: "testCategory",
    render: (row) => (
      <Badge variant="purple">
        {row.testCategory.replace(/_/g, " ")}
      </Badge>
    ),
  },
  {
    header: "Result",
    accessor: "passFail",
    render: (row) => <StatusBadge status={row.passFail} />,
  },
  {
    header: "Severity",
    accessor: "severity",
    render: (row) =>
      row.severity ? <SeverityBadge severity={row.severity} /> : <span className="text-slate-500">—</span>,
  },
  {
    header: "Run By",
    accessor: "runBy",
    render: (row) => <span className="text-sm text-slate-400">{row.runBy ?? "—"}</span>,
  },
  {
    header: "Date",
    accessor: "runDate",
    render: (row) => <span className="text-sm text-slate-400">{formatDate(row.runDate)}</span>,
  },
];

export default function RedTeamPage() {
  const [tests, setTests] = useState<RedTeamTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/red-team")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setTests(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const failed = tests.filter((t) => t.passFail === "fail").length;
  const passed = tests.filter((t) => t.passFail === "pass").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Red Team Center</h1>
          <p className="text-sm text-slate-400 mt-1">
            Adversarial testing for AI system vulnerabilities
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Zap className="w-4 h-4" />
          New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tests", value: tests.length, icon: Target, color: "text-purple-400" },
          { label: "Failed", value: failed, icon: ShieldAlert, color: "text-red-400" },
          { label: "Passed", value: passed, icon: CheckCircle, color: "text-emerald-400" },
          {
            label: "Pending",
            value: tests.filter((t) => t.passFail === "pending").length,
            icon: Target,
            color: "text-slate-400",
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
          data={tests as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search tests..."
          searchableFields={["testName" as keyof RedTeamTest, "testCategory" as keyof RedTeamTest]}
          emptyMessage="No red team tests found. Create your first test."
        />
      )}
    </div>
  );
}
