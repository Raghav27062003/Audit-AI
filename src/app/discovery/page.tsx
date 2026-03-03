"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Search, Scan, AlertTriangle } from "lucide-react";

interface AiAsset {
  id: number;
  assetName: string;
  assetType: string;
  vendor: string | null;
  department: string | null;
  discoveredVia: string;
  riskScore: number | null;
  governanceStatus: string;
  dataSensitivity: string | null;
  usersCount: number;
  lastActivity: string | null;
  createdAt: string;
}

const columns: Column<AiAsset>[] = [
  {
    header: "Asset",
    accessor: "assetName",
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-slate-200">{row.assetName}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {row.assetType.replace(/_/g, " ")} {row.vendor ? `· ${row.vendor}` : ""}
        </p>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "governanceStatus",
    render: (row) => <StatusBadge status={row.governanceStatus} />,
  },
  {
    header: "Risk",
    accessor: "riskScore",
    render: (row) =>
      row.riskScore !== null ? (
        <SeverityBadge
          severity={
            row.riskScore >= 8 ? "critical" : row.riskScore >= 6 ? "high" : row.riskScore >= 4 ? "medium" : "low"
          }
        />
      ) : (
        <span className="text-slate-500">—</span>
      ),
  },
  {
    header: "Data Sensitivity",
    accessor: "dataSensitivity",
    render: (row) =>
      row.dataSensitivity ? (
        <SeverityBadge severity={row.dataSensitivity} />
      ) : (
        <span className="text-slate-500">—</span>
      ),
  },
  {
    header: "Discovery",
    accessor: "discoveredVia",
    render: (row) => (
      <Badge variant="purple">{row.discoveredVia.replace(/_/g, " ")}</Badge>
    ),
  },
  {
    header: "Users",
    accessor: "usersCount",
    render: (row) => <span className="text-sm text-slate-300">{row.usersCount}</span>,
  },
  {
    header: "Department",
    accessor: "department",
    render: (row) => <span className="text-sm text-slate-400">{row.department ?? "—"}</span>,
  },
];

export default function DiscoveryPage() {
  const [assets, setAssets] = useState<AiAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assets")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setAssets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unregistered = assets.filter((a) => a.governanceStatus === "unregistered").length;
  const highRisk = assets.filter((a) => (a.riskScore ?? 0) >= 7).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">AI Asset Discovery</h1>
          <p className="text-sm text-slate-400 mt-1">
            Discover and govern shadow AI across your organization
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Scan className="w-4 h-4" />
          Run Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assets", value: assets.length, color: "text-cyan-400" },
          { label: "Unregistered", value: unregistered, color: "text-orange-400" },
          { label: "High Risk", value: highRisk, color: "text-red-400" },
          {
            label: "Authorized",
            value: assets.filter((a) => a.governanceStatus === "authorized").length,
            color: "text-emerald-400",
          },
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
          data={assets as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search AI assets..."
          searchableFields={["assetName" as keyof AiAsset, "vendor" as keyof AiAsset, "department" as keyof AiAsset]}
          emptyMessage="No AI assets discovered. Run a scan to begin."
        />
      )}
    </div>
  );
}
