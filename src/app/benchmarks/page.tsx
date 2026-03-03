"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { TrendingUp, BarChart3, Target } from "lucide-react";

interface BenchmarkData {
  id: number;
  industry: string;
  category: string;
  avgScore: number;
  percentile25: number | null;
  percentile50: number | null;
  percentile75: number | null;
  sampleSize: number;
  period: string;
  updatedAt: string;
}

const columns: Column<BenchmarkData>[] = [
  {
    header: "Category",
    accessor: "category",
    render: (row) => (
      <span className="text-sm font-medium text-slate-200">{row.category}</span>
    ),
  },
  {
    header: "Industry",
    accessor: "industry",
    render: (row) => <Badge variant="purple">{row.industry}</Badge>,
  },
  {
    header: "Avg Score",
    accessor: "avgScore",
    render: (row) => {
      const color =
        row.avgScore >= 80
          ? "text-emerald-400"
          : row.avgScore >= 60
            ? "text-yellow-400"
            : row.avgScore >= 40
              ? "text-orange-400"
              : "text-red-400";
      return <span className={`text-sm font-bold ${color}`}>{row.avgScore}</span>;
    },
  },
  {
    header: "25th %ile",
    accessor: "percentile25",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.percentile25 ?? "—"}</span>
    ),
  },
  {
    header: "Median",
    accessor: "percentile50",
    render: (row) => (
      <span className="text-sm text-slate-300 font-medium">{row.percentile50 ?? "—"}</span>
    ),
  },
  {
    header: "75th %ile",
    accessor: "percentile75",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.percentile75 ?? "—"}</span>
    ),
  },
  {
    header: "Sample Size",
    accessor: "sampleSize",
    render: (row) => (
      <span className="text-sm text-slate-400">{row.sampleSize}</span>
    ),
  },
  {
    header: "Period",
    accessor: "period",
    render: (row) => (
      <span className="text-sm text-slate-500">{row.period}</span>
    ),
  },
];

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<BenchmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/benchmarks")
      .then((res) => res.json())
      .then((data) => {
        setBenchmarks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const industries = ["all", ...new Set(benchmarks.map((b) => b.industry))];
  const tabs = industries.map((i) => ({
    id: i,
    label: i === "all" ? "All Industries" : i,
  }));

  const filtered =
    activeTab === "all"
      ? benchmarks
      : benchmarks.filter((b) => b.industry === activeTab);

  const avgOverall =
    benchmarks.length > 0
      ? Math.round((benchmarks.reduce((s, b) => s + b.avgScore, 0) / benchmarks.length) * 10) / 10
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Benchmarks</h1>
        <p className="text-sm text-slate-400 mt-1">
          Industry benchmarks for AI governance performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Benchmarks", value: benchmarks.length, icon: BarChart3, color: "text-purple-400" },
          { label: "Avg Score", value: avgOverall, icon: TrendingUp, color: "text-cyan-400" },
          { label: "Industries", value: new Set(benchmarks.map((b) => b.industry)).size, icon: Target, color: "text-blue-400" },
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

      {tabs.length > 1 && (
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      )}

      {loading ? (
        <div className="glass-card p-12 text-center">
          <div className="skeleton h-4 w-48 mx-auto" />
        </div>
      ) : (
        <DataTable
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          searchPlaceholder="Search benchmarks..."
          searchableFields={["category" as keyof BenchmarkData, "industry" as keyof BenchmarkData]}
          emptyMessage="No benchmark data available."
        />
      )}
    </div>
  );
}
