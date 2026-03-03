"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { SeverityBadge } from "@/components/ui/SeverityBadge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  Bot,
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
  riskTrend: {
    month: string;
    riskScore: number;
    findings: number;
    complianceRate: number;
  }[];
}

export default function ExecutivePage() {
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
          <h1 className="text-2xl font-bold text-slate-100">Executive Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">High-level AI governance overview</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-8">
              <div className="skeleton h-6 w-32 mb-4" />
              <div className="skeleton h-10 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const auditCompletionRate =
    stats.totalAudits > 0
      ? Math.round((stats.completedAudits / stats.totalAudits) * 100)
      : 0;

  const findingResolutionRate =
    stats.totalFindings > 0
      ? Math.round(((stats.totalFindings - stats.openFindings) / stats.totalFindings) * 100)
      : 0;

  const assetGovernanceRate =
    stats.totalAssets > 0
      ? Math.round(((stats.totalAssets - stats.unregisteredAssets) / stats.totalAssets) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Executive Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          High-level AI governance overview for leadership
        </p>
      </div>

      {/* Key Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Compliance Rate" icon={Shield}>
          <div className="flex justify-center py-2">
            <ScoreGauge score={stats.complianceRate} size={140} strokeWidth={10} label="Compliant" />
          </div>
        </Card>
        <Card title="Audit Completion" icon={CheckCircle}>
          <div className="flex justify-center py-2">
            <ScoreGauge score={auditCompletionRate} size={140} strokeWidth={10} label="Complete" />
          </div>
        </Card>
        <Card title="Finding Resolution" icon={AlertTriangle}>
          <div className="flex justify-center py-2">
            <ScoreGauge score={findingResolutionRate} size={140} strokeWidth={10} label="Resolved" />
          </div>
        </Card>
        <Card title="Asset Governance" icon={Bot}>
          <div className="flex justify-center py-2">
            <ScoreGauge score={assetGovernanceRate} size={140} strokeWidth={10} label="Governed" />
          </div>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Risk Overview" icon={BarChart3}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Average Risk Score</span>
              <span className="text-lg font-bold text-yellow-400">{stats.avgRiskScore}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Critical Findings</span>
              <span className="text-lg font-bold text-red-400">{stats.criticalFindings}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Alerts</span>
              <span className="text-lg font-bold text-orange-400">{stats.activeAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Open Findings</span>
              <span className="text-lg font-bold text-blue-400">{stats.openFindings}</span>
            </div>
          </div>
        </Card>

        <Card title="AI Portfolio" icon={Activity}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Total AI Assets</span>
              <span className="text-lg font-bold text-cyan-400">{stats.totalAssets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">AI Agents</span>
              <span className="text-lg font-bold text-blue-400">{stats.totalAgents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Unregistered</span>
              <span className="text-lg font-bold text-orange-400">{stats.unregisteredAssets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Active Audits</span>
              <span className="text-lg font-bold text-purple-400">{stats.activeAudits}</span>
            </div>
          </div>
        </Card>

        <Card title="Trend (Last 3 months)" icon={TrendingUp}>
          <div className="space-y-3">
            {stats.riskTrend.slice(-3).map((item) => (
              <div
                key={item.month}
                className="p-3 rounded-lg bg-[rgba(139,92,246,0.04)] border border-[rgba(139,92,246,0.08)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">{item.month}</span>
                  <SeverityBadge
                    severity={item.riskScore >= 7 ? "high" : item.riskScore >= 5 ? "medium" : "low"}
                  />
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Findings: {item.findings}</span>
                  <span>Compliance: {item.complianceRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
