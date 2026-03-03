"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { Siren, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Incident {
  id: number;
  incidentType: string;
  severity: string;
  description: string;
  playbookUsed: string | null;
  status: string;
  rootCause: string | null;
  reportedAt: string;
  resolvedAt: string | null;
  audit: { id: number; title: string } | null;
  asset: { id: number; assetName: string } | null;
}

const columns: Column<Incident>[] = [
  {
    header: "Incident",
    accessor: "description",
    render: (row) => (
      <div className="max-w-sm">
        <p className="text-sm font-medium text-slate-200 truncate">{row.description}</p>
        {row.asset && (
          <p className="text-xs text-slate-500 mt-0.5">Asset: {row.asset.assetName}</p>
        )}
      </div>
    ),
  },
  {
    header: "Type",
    accessor: "incidentType",
    render: (row) => (
      <Badge variant="danger">{row.incidentType.replace(/_/g, " ")}</Badge>
    ),
  },
  {
    header: "Severity",
    accessor: "severity",
    render: (row) => <SeverityBadge severity={row.severity} />,
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    header: "Playbook",
    accessor: "playbookUsed",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.playbookUsed ?? "—"}</span>
    ),
  },
  {
    header: "Reported",
    accessor: "reportedAt",
    render: (row) => (
      <span className="text-sm text-slate-400">{formatDateTime(row.reportedAt)}</span>
    ),
  },
];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/incidents")
      .then((res) => res.json())
      .then((data) => {
        setIncidents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const active = incidents.filter(
    (i) => i.status !== "resolved" && i.status !== "post_mortem"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Incident Response</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage and respond to AI-related security incidents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Incidents", value: incidents.length, icon: Siren, color: "text-purple-400" },
          { label: "Active", value: active, icon: AlertTriangle, color: "text-red-400" },
          {
            label: "Resolved",
            value: incidents.filter((i) => i.status === "resolved").length,
            icon: CheckCircle,
            color: "text-emerald-400",
          },
          {
            label: "Critical",
            value: incidents.filter((i) => i.severity === "critical").length,
            icon: Clock,
            color: "text-orange-400",
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
          data={incidents as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search incidents..."
          searchableFields={["description" as keyof Incident, "incidentType" as keyof Incident]}
          emptyMessage="No incidents reported."
        />
      )}
    </div>
  );
}
