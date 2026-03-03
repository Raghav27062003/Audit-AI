"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { Activity, AlertTriangle, CheckCircle, Bell } from "lucide-react";

interface MonitoringAlert {
  id: number;
  auditId: number | null;
  assetId: number | null;
  alertType: string;
  severity: string;
  description: string;
  metricName: string | null;
  expectedValue: string | null;
  actualValue: string | null;
  threshold: string | null;
  triggeredAt: string;
  status: string;
}

const columns: Column<MonitoringAlert>[] = [
  {
    header: "Alert",
    accessor: "description",
    render: (row) => (
      <div className="max-w-sm">
        <p className="text-sm font-medium text-slate-200 truncate">{row.description}</p>
        {row.metricName && (
          <p className="text-xs text-slate-500 mt-0.5">
            Metric: {row.metricName}
            {row.actualValue && row.expectedValue
              ? ` (${row.actualValue} vs expected ${row.expectedValue})`
              : ""}
          </p>
        )}
      </div>
    ),
  },
  {
    header: "Type",
    accessor: "alertType",
    render: (row) => (
      <Badge variant="info">{row.alertType.replace(/_/g, " ")}</Badge>
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
    header: "Triggered",
    accessor: "triggeredAt",
    render: (row) => (
      <span className="text-sm text-slate-400">{formatDateTime(row.triggeredAt)}</span>
    ),
  },
];

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/monitoring")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const active = alerts.filter((a) => a.status === "active").length;
  const critical = alerts.filter((a) => a.severity === "critical").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Continuous Monitoring</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time alerts for AI system drift, bias, and performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Alerts", value: alerts.length, icon: Bell, color: "text-purple-400" },
          { label: "Active", value: active, icon: Activity, color: "text-orange-400" },
          { label: "Critical", value: critical, icon: AlertTriangle, color: "text-red-400" },
          {
            label: "Resolved",
            value: alerts.filter((a) => a.status === "resolved").length,
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
          data={alerts as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search alerts..."
          searchableFields={["description" as keyof MonitoringAlert, "alertType" as keyof MonitoringAlert]}
          emptyMessage="No monitoring alerts. All systems operating normally."
        />
      )}
    </div>
  );
}
