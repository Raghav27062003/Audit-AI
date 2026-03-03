"use client";

import { useEffect, useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { Badge } from "@/components/ui/Badge";
import { Bot, Shield, AlertTriangle } from "lucide-react";

interface AiAgent {
  id: number;
  agentName: string;
  agentType: string;
  description: string | null;
  autonomyLevel: string;
  toolsAccess: string | null;
  dataAccess: string | null;
  riskScore: number | null;
  governanceStatus: string;
  owner: string | null;
  createdAt: string;
}

const autonomyLabels: Record<string, { label: string; variant: "success" | "info" | "warning" | "danger" }> = {
  human_in_loop: { label: "Human-in-Loop", variant: "success" },
  human_on_loop: { label: "Human-on-Loop", variant: "info" },
  human_out_of_loop: { label: "Human-out-of-Loop", variant: "warning" },
  fully_autonomous: { label: "Fully Autonomous", variant: "danger" },
};

const columns: Column<AiAgent>[] = [
  {
    header: "Agent",
    accessor: "agentName",
    render: (row) => (
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-slate-200">{row.agentName}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 ml-6">
          {row.agentType.replace(/_/g, " ")}
        </p>
      </div>
    ),
  },
  {
    header: "Autonomy",
    accessor: "autonomyLevel",
    render: (row) => {
      const info = autonomyLabels[row.autonomyLevel] ?? { label: row.autonomyLevel, variant: "default" as const };
      return <Badge variant={info.variant}>{info.label}</Badge>;
    },
  },
  {
    header: "Governance",
    accessor: "governanceStatus",
    render: (row) => <StatusBadge status={row.governanceStatus} />,
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
    header: "Owner",
    accessor: "owner",
    render: (row) => <span className="text-sm text-slate-400">{row.owner ?? "—"}</span>,
  },
  {
    header: "Tools",
    accessor: "toolsAccess",
    render: (row) => {
      if (!row.toolsAccess) return <span className="text-slate-500">—</span>;
      try {
        const tools = JSON.parse(row.toolsAccess);
        return <span className="text-sm text-slate-300">{tools.length} tools</span>;
      } catch {
        return <span className="text-sm text-slate-300">—</span>;
      }
    },
  },
];

export default function AgenticPage() {
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data) => {
        setAgents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const autonomous = agents.filter(
    (a) => a.autonomyLevel === "fully_autonomous" || a.autonomyLevel === "human_out_of_loop"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Agentic AI Governance</h1>
        <p className="text-sm text-slate-400 mt-1">
          Govern and monitor autonomous AI agents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: agents.length, icon: Bot, color: "text-blue-400" },
          { label: "Autonomous", value: autonomous, icon: AlertTriangle, color: "text-orange-400" },
          {
            label: "Approved",
            value: agents.filter((a) => a.governanceStatus === "approved").length,
            icon: Shield,
            color: "text-emerald-400",
          },
          {
            label: "Blocked",
            value: agents.filter((a) => a.governanceStatus === "blocked").length,
            icon: AlertTriangle,
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

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="skeleton h-4 w-48 mx-auto" />
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={agents as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search agents..."
          searchableFields={["agentName" as keyof AiAgent, "agentType" as keyof AiAgent, "owner" as keyof AiAgent]}
          emptyMessage="No AI agents registered."
        />
      )}
    </div>
  );
}
