"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import {
  ClipboardList,
  AlertTriangle,
  Search,
  Bot,
  Activity,
  Shield,
  TrendingUp,
  Globe,
} from "lucide-react";

interface DashboardStats {
  totalAudits: number;
  completedAudits: number;
  activeAudits: number;
  totalFindings: number;
  criticalFindings: number;
  openFindings: number;
  totalAssets: number;
  unregisteredAssets: number;
  totalAgents: number;
  activeAlerts: number;
  avgRiskScore: number;
  complianceRate: number;
  recentActivity: {
    type: string;
    id: number;
    title: string;
    severity: string;
    status: string;
    timestamp: string;
    context: string | null;
  }[];
  riskTrend: {
    month: string;
    riskScore: number;
    findings: number;
    remediations: number;
    complianceRate: number;
  }[];
  regulationCountdown: {
    id: number;
    regulationName: string;
    country: string;
    effectiveDate: string;
    impactLevel: string;
    status: string;
    daysUntilDeadline: number | null;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">AI Governance & Audit Overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Audits",
      value: stats.totalAudits,
      sub: `${stats.activeAudits} active`,
      icon: ClipboardList,
      color: "text-purple-400",
    },
    {
      label: "Open Findings",
      value: stats.openFindings,
      sub: `${stats.criticalFindings} critical`,
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      label: "AI Assets",
      value: stats.totalAssets,
      sub: `${stats.unregisteredAssets} unregistered`,
      icon: Search,
      color: "text-cyan-400",
    },
    {
      label: "AI Agents",
      value: stats.totalAgents,
      sub: "Governed",
      icon: Bot,
      color: "text-blue-400",
    },
    {
      label: "Active Alerts",
      value: stats.activeAlerts,
      sub: "Monitoring",
      icon: Activity,
      color: "text-orange-400",
    },
    {
      label: "Avg Risk Score",
      value: stats.avgRiskScore,
      sub: "Out of 25",
      icon: Shield,
      color: "text-yellow-400",
    },
    {
      label: "Compliance Rate",
      value: `${stats.complianceRate}%`,
      sub: "Overall",
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Regulations",
      value: stats.regulationCountdown.length,
      sub: "Upcoming",
      icon: Globe,
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          AI Governance & Audit Overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-100">
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Score */}
        <Card title="Compliance Score" icon={Shield}>
          <div className="flex items-center justify-center py-4">
            <ScoreGauge
              score={stats.complianceRate}
              size={160}
              strokeWidth={10}
              label="Compliant"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="text-center p-3 rounded-lg bg-[rgba(139,92,246,0.06)]">
              <div className="text-lg font-bold text-emerald-400">
                {stats.completedAudits}
              </div>
              <div className="text-xs text-slate-400">Completed</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-[rgba(139,92,246,0.06)]">
              <div className="text-lg font-bold text-blue-400">
                {stats.activeAudits}
              </div>
              <div className="text-xs text-slate-400">Active</div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" icon={Activity} className="lg:col-span-2">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">
                No recent activity
              </p>
            ) : (
              stats.recentActivity.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgba(139,92,246,0.04)] hover:bg-[rgba(139,92,246,0.08)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 bg-[rgba(139,92,246,0.1)] px-1.5 py-0.5 rounded">
                        {item.type}
                      </span>
                      <span className="text-sm text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>
                    {item.context && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {item.context}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <SeverityBadge severity={item.severity} />
                    <span className="text-xs text-slate-500">
                      {formatDateTime(item.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Risk Trend & Regulation Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend */}
        <Card title="Risk Trend (12 months)" icon={TrendingUp}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.riskTrend.map((item) => (
              <div
                key={item.month}
                className="flex items-center justify-between py-2 border-b border-[rgba(139,92,246,0.06)] last:border-0"
              >
                <span className="text-sm text-slate-300">{item.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">
                    Risk: <span className="text-yellow-400">{item.riskScore}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Findings: <span className="text-red-400">{item.findings}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    Compliance:{" "}
                    <span className="text-emerald-400">{item.complianceRate}%</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regulation Countdown */}
        <Card title="Upcoming Regulations" icon={Globe}>
          {stats.regulationCountdown.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">
              No upcoming regulations
            </p>
          ) : (
            <div className="space-y-3">
              {stats.regulationCountdown.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 rounded-lg bg-[rgba(139,92,246,0.04)] border border-[rgba(139,92,246,0.08)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-200">
                      {reg.regulationName}
                    </span>
                    <SeverityBadge severity={reg.impactLevel} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{reg.country}</span>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={reg.status} />
                      {reg.daysUntilDeadline !== null && (
                        <span className="text-xs font-medium text-orange-400">
                          {reg.daysUntilDeadline}d remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
