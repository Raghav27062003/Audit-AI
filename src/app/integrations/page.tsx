"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { Plug, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Integration {
  id: number;
  integrationType: string;
  config: string | null;
  status: string;
  lastSync: string | null;
  createdBy: string | null;
  createdAt: string;
}

const integrationInfo: Record<string, { label: string; description: string }> = {
  jira: { label: "Jira", description: "Project management & issue tracking" },
  servicenow: { label: "ServiceNow", description: "IT service management" },
  slack: { label: "Slack", description: "Team messaging & notifications" },
  teams: { label: "Microsoft Teams", description: "Team collaboration" },
  github: { label: "GitHub", description: "Code repository & CI/CD" },
  gitlab: { label: "GitLab", description: "DevOps platform" },
  aws: { label: "AWS", description: "Amazon Web Services" },
  azure: { label: "Azure", description: "Microsoft Azure cloud" },
  gcp: { label: "GCP", description: "Google Cloud Platform" },
  webhook: { label: "Webhook", description: "Custom HTTP callbacks" },
  api: { label: "REST API", description: "Custom API integration" },
  siem: { label: "SIEM", description: "Security information & event management" },
  sso: { label: "SSO", description: "Single sign-on authentication" },
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/integrations")
      .then((res) => res.json())
      .then((data) => {
        setIntegrations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const active = integrations.filter((i) => i.status === "active").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Integrations</h1>
          <p className="text-sm text-slate-400 mt-1">Connect with your tools</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="skeleton h-4 w-32 mb-3" />
              <div className="skeleton h-3 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Integrations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Connect AuditAI with your existing tools and workflows
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Plug className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: integrations.length, icon: Plug, color: "text-purple-400" },
          { label: "Active", value: active, icon: CheckCircle, color: "text-emerald-400" },
          {
            label: "Errors",
            value: integrations.filter((i) => i.status === "error").length,
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

      {integrations.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Plug className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No integrations configured</p>
          <p className="text-xs text-slate-500 mt-1">
            Connect your tools to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const info = integrationInfo[integration.integrationType] ?? {
              label: integration.integrationType,
              description: "Custom integration",
            };
            return (
              <div
                key={integration.id}
                className="glass-card p-5 hover:border-[rgba(139,92,246,0.3)] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(139,92,246,0.12)] flex items-center justify-center">
                    <Plug className="w-5 h-5 text-purple-400" />
                  </div>
                  <StatusBadge status={integration.status} />
                </div>
                <h3 className="text-sm font-semibold text-slate-100 mb-0.5">
                  {info.label}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{info.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {integration.lastSync
                      ? `Last sync: ${formatDateTime(integration.lastSync)}`
                      : "Never synced"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
