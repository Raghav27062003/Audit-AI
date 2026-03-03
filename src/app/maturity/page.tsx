"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Star } from "lucide-react";

interface MaturityAssessment {
  id: number;
  assessmentDate: string;
  dimension: string;
  questionId: string;
  questionText: string;
  maturityLevel: number;
  evidence: string | null;
  overallScore: number | null;
  assessedBy: string | null;
}

const dimensionLabels: Record<string, string> = {
  strategy_leadership: "Strategy & Leadership",
  policies_processes: "Policies & Processes",
  technology_tools: "Technology & Tools",
  people_culture: "People & Culture",
  monitoring_improvement: "Monitoring & Improvement",
};

const levelLabels: Record<number, { label: string; variant: "danger" | "warning" | "info" | "success" | "purple" }> = {
  1: { label: "Initial", variant: "danger" },
  2: { label: "Developing", variant: "warning" },
  3: { label: "Defined", variant: "info" },
  4: { label: "Managed", variant: "success" },
  5: { label: "Optimizing", variant: "purple" },
};

export default function MaturityPage() {
  const [assessments, setAssessments] = useState<MaturityAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/maturity")
      .then((res) => res.json())
      .then((data) => {
        setAssessments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group by dimension
  const dimensions = Object.keys(dimensionLabels);
  const dimensionScores = dimensions.map((dim) => {
    const items = assessments.filter((a) => a.dimension === dim);
    const avg =
      items.length > 0
        ? Math.round((items.reduce((s, i) => s + i.maturityLevel, 0) / items.length) * 10) / 10
        : 0;
    return { dimension: dim, label: dimensionLabels[dim], score: avg, count: items.length };
  });

  const overallScore =
    dimensionScores.length > 0
      ? Math.round(
          (dimensionScores.reduce((s, d) => s + d.score, 0) / dimensionScores.filter((d) => d.count > 0).length || 1) * 20
        )
      : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Maturity Assessment</h1>
          <p className="text-sm text-slate-400 mt-1">AI governance maturity across dimensions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-8">
              <div className="skeleton h-4 w-32 mb-4" />
              <div className="skeleton h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Maturity Assessment</h1>
        <p className="text-sm text-slate-400 mt-1">
          Assess AI governance maturity across key dimensions
        </p>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Overall Maturity" icon={Trophy}>
          <div className="flex justify-center py-4">
            <ScoreGauge score={overallScore} size={160} strokeWidth={10} label="Score" />
          </div>
        </Card>

        <Card title="Dimension Scores" icon={Star} className="md:col-span-2">
          <div className="space-y-4">
            {dimensionScores.map((dim) => (
              <div key={dim.dimension} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-300">
                      {dim.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {dim.count > 0 ? (
                        <Badge variant={levelLabels[Math.round(dim.score)]?.variant ?? "default"}>
                          {levelLabels[Math.round(dim.score)]?.label ?? `Level ${Math.round(dim.score)}`}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500">Not assessed</span>
                      )}
                      <span className="text-sm font-bold text-slate-200">{dim.score}/5</span>
                    </div>
                  </div>
                  <div className="w-full bg-[rgba(139,92,246,0.1)] rounded-full h-2">
                    <div
                      className="h-2 rounded-full gradient-accent transition-all duration-500"
                      style={{ width: `${(dim.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assessment Details */}
      {assessments.length > 0 && (
        <Card title="Assessment Questions" icon={Trophy}>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {assessments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[rgba(139,92,246,0.04)] hover:bg-[rgba(139,92,246,0.08)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{a.questionText}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {dimensionLabels[a.dimension] ?? a.dimension}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < a.maturityLevel ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
