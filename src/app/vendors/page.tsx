"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Building2, Shield, AlertTriangle, Calendar } from "lucide-react";

interface VendorAssessment {
  id: number;
  vendorName: string;
  vendorType: string;
  assessmentDate: string;
  riskScore: number | null;
  complianceStatus: string | null;
  contractExpiry: string | null;
  keyRisks: string | null;
  assessor: string | null;
}

const columns: Column<VendorAssessment>[] = [
  {
    header: "Vendor",
    accessor: "vendorName",
    render: (row) => (
      <div>
        <p className="text-sm font-medium text-slate-200">{row.vendorName}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {row.vendorType.replace(/_/g, " ")}
        </p>
      </div>
    ),
  },
  {
    header: "Risk Score",
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
    header: "Compliance",
    accessor: "complianceStatus",
    render: (row) =>
      row.complianceStatus ? (
        <StatusBadge status={row.complianceStatus} />
      ) : (
        <span className="text-slate-500">—</span>
      ),
  },
  {
    header: "Contract Expiry",
    accessor: "contractExpiry",
    render: (row) => {
      if (!row.contractExpiry) return <span className="text-slate-500">—</span>;
      const isExpiringSoon =
        new Date(row.contractExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000;
      return (
        <span className={`text-sm ${isExpiringSoon ? "text-orange-400" : "text-slate-400"}`}>
          {formatDate(row.contractExpiry)}
        </span>
      );
    },
  },
  {
    header: "Key Risks",
    accessor: "keyRisks",
    render: (row) => {
      if (!row.keyRisks) return <span className="text-slate-500">—</span>;
      try {
        const risks = JSON.parse(row.keyRisks);
        return (
          <span className="text-sm text-slate-300">{risks.length} identified</span>
        );
      } catch {
        return <span className="text-slate-500">—</span>;
      }
    },
  },
  {
    header: "Assessor",
    accessor: "assessor",
    render: (row) => <span className="text-sm text-slate-400">{row.assessor ?? "—"}</span>,
  },
  {
    header: "Assessed",
    accessor: "assessmentDate",
    render: (row) => (
      <span className="text-sm text-slate-400">{formatDate(row.assessmentDate)}</span>
    ),
  },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => {
        setVendors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Vendor AI Risk</h1>
        <p className="text-sm text-slate-400 mt-1">
          Assess and manage AI vendor risks and compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", value: vendors.length, icon: Building2, color: "text-purple-400" },
          {
            label: "High Risk",
            value: vendors.filter((v) => (v.riskScore ?? 0) >= 7).length,
            icon: AlertTriangle,
            color: "text-red-400",
          },
          {
            label: "Compliant",
            value: vendors.filter((v) => v.complianceStatus === "compliant").length,
            icon: Shield,
            color: "text-emerald-400",
          },
          {
            label: "Expiring Soon",
            value: vendors.filter(
              (v) =>
                v.contractExpiry &&
                new Date(v.contractExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000
            ).length,
            icon: Calendar,
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
          data={vendors as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search vendors..."
          searchableFields={["vendorName" as keyof VendorAssessment, "vendorType" as keyof VendorAssessment]}
          emptyMessage="No vendor assessments found."
        />
      )}
    </div>
  );
}
