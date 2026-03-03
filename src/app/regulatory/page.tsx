"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { Map, Globe, Calendar } from "lucide-react";

interface RegulatoryUpdate {
  id: number;
  country: string;
  region: string | null;
  regulationName: string;
  description: string;
  effectiveDate: string | null;
  impactLevel: string;
  affectedCategories: string | null;
  sourceUrl: string | null;
  status: string;
  createdAt: string;
}

const columns: Column<RegulatoryUpdate>[] = [
  {
    header: "Regulation",
    accessor: "regulationName",
    render: (row) => (
      <div className="max-w-xs">
        <p className="text-sm font-medium text-slate-200">{row.regulationName}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{row.description}</p>
      </div>
    ),
  },
  {
    header: "Country",
    accessor: "country",
    render: (row) => (
      <div className="flex items-center gap-2">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-sm text-slate-300">{row.country}</span>
      </div>
    ),
  },
  {
    header: "Impact",
    accessor: "impactLevel",
    render: (row) => <SeverityBadge severity={row.impactLevel} />,
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Effective Date",
    accessor: "effectiveDate",
    render: (row) => (
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-sm text-slate-400">
          {row.effectiveDate ? formatDate(row.effectiveDate) : "TBD"}
        </span>
      </div>
    ),
  },
];

export default function RegulatoryPage() {
  const [updates, setUpdates] = useState<RegulatoryUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/regulatory")
      .then((res) => res.json())
      .then((data) => {
        setUpdates(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const critical = updates.filter((u) => u.impactLevel === "critical").length;
  const enacted = updates.filter((u) => u.status === "enacted" || u.status === "enforced").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Regulatory Intelligence</h1>
        <p className="text-sm text-slate-400 mt-1">
          Track global AI regulations and their impact on your organization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Regulations", value: updates.length, color: "text-purple-400" },
          { label: "Critical Impact", value: critical, color: "text-red-400" },
          { label: "Enacted / Enforced", value: enacted, color: "text-emerald-400" },
          { label: "Countries", value: new Set(updates.map((u) => u.country)).size, color: "text-cyan-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="skeleton h-4 w-48 mx-auto" />
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={updates as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search regulations..."
          searchableFields={["regulationName" as keyof RegulatoryUpdate, "country" as keyof RegulatoryUpdate]}
          emptyMessage="No regulatory updates found."
        />
      )}
    </div>
  );
}
