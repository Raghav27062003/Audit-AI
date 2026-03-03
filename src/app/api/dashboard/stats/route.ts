import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Fetch all counts and aggregations in parallel
    const [
      totalAudits,
      completedAudits,
      activeAudits,
      totalFindings,
      criticalFindings,
      openFindings,
      totalAssets,
      unregisteredAssets,
      totalAgents,
      activeAlerts,
      riskRegisters,
      complianceChecks,
      recentFindings,
      recentAlerts,
      upcomingRegulations,
    ] = await Promise.all([
      prisma.audit.count(),
      prisma.audit.count({ where: { status: "completed" } }),
      prisma.audit.count({
        where: { status: { in: ["in_progress", "review"] } },
      }),
      prisma.finding.count(),
      prisma.finding.count({ where: { severity: "critical" } }),
      prisma.finding.count({ where: { status: "open" } }),
      prisma.aiAsset.count(),
      prisma.aiAsset.count({ where: { governanceStatus: "unregistered" } }),
      prisma.aiAgent.count(),
      prisma.monitoringAlert.count({ where: { status: "active" } }),
      prisma.riskRegister.findMany({
        select: { riskScore: true },
      }),
      prisma.complianceCheck.findMany({
        select: { status: true },
      }),
      prisma.finding.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          severity: true,
          status: true,
          createdAt: true,
          audit: { select: { id: true, title: true } },
        },
      }),
      prisma.monitoringAlert.findMany({
        orderBy: { triggeredAt: "desc" },
        take: 10,
        select: {
          id: true,
          alertType: true,
          severity: true,
          description: true,
          status: true,
          triggeredAt: true,
          asset: { select: { id: true, assetName: true } },
        },
      }),
      prisma.regulatoryUpdate.findMany({
        where: {
          effectiveDate: { gte: new Date() },
        },
        orderBy: { effectiveDate: "asc" },
        take: 3,
        select: {
          id: true,
          regulationName: true,
          country: true,
          effectiveDate: true,
          impactLevel: true,
          status: true,
        },
      }),
    ]);

    // Calculate average risk score
    const avgRiskScore =
      riskRegisters.length > 0
        ? Math.round(
            (riskRegisters.reduce(
              (sum, r) => sum + (r.riskScore ?? 0),
              0
            ) /
              riskRegisters.length) *
              100
          ) / 100
        : 0;

    // Calculate compliance rate
    const totalComplianceChecks = complianceChecks.length;
    const compliantChecks = complianceChecks.filter(
      (c) => c.status === "compliant"
    ).length;
    const complianceRate =
      totalComplianceChecks > 0
        ? Math.round((compliantChecks / totalComplianceChecks) * 10000) / 100
        : 0;

    // Combine recent findings and alerts into recent activity
    const recentActivity = [
      ...recentFindings.map((f) => ({
        type: "finding" as const,
        id: f.id,
        title: f.title,
        severity: f.severity,
        status: f.status,
        timestamp: f.createdAt,
        context: f.audit?.title ?? null,
      })),
      ...recentAlerts.map((a) => ({
        type: "alert" as const,
        id: a.id,
        title: a.description,
        severity: a.severity,
        status: a.status,
        timestamp: a.triggeredAt,
        context: a.asset?.assetName ?? null,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 10);

    // Generate mock risk trend data (monthly for the last 12 months)
    const riskTrend = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        riskScore: Math.round((Math.random() * 3 + 4) * 10) / 10,
        findings: Math.floor(Math.random() * 15 + 5),
        remediations: Math.floor(Math.random() * 10 + 3),
        complianceRate: Math.round(Math.random() * 20 + 70),
      };
    });

    // Regulation countdown
    const regulationCountdown = upcomingRegulations.map((reg) => ({
      id: reg.id,
      regulationName: reg.regulationName,
      country: reg.country,
      effectiveDate: reg.effectiveDate,
      impactLevel: reg.impactLevel,
      status: reg.status,
      daysUntilDeadline: reg.effectiveDate
        ? Math.ceil(
            (new Date(reg.effectiveDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    }));

    return NextResponse.json({
      totalAudits,
      completedAudits,
      activeAudits,
      totalFindings,
      criticalFindings,
      openFindings,
      totalAssets,
      unregisteredAssets,
      totalAgents,
      activeAlerts,
      avgRiskScore,
      complianceRate,
      recentActivity,
      riskTrend,
      regulationCountdown,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
