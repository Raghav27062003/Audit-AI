import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");

    const where: Record<string, unknown> = {};
    if (auditId) where.auditId = parseInt(auditId);

    const results = await prisma.aiAnalysisResult.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching AI analysis results:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI analysis results" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auditId, analysisType } = body;

    if (!auditId || !analysisType) {
      return NextResponse.json(
        { error: "auditId and analysisType are required" },
        { status: 400 }
      );
    }

    // Verify audit exists
    const audit = await prisma.audit.findUnique({
      where: { id: auditId },
      include: { findings: true, checklists: true, complianceChecks: true },
    });

    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    // Generate mock AI analysis output based on analysis type
    const mockOutputs: Record<string, object> = {
      auto_audit: {
        summary: `Automated AI audit analysis for "${audit.title}"`,
        overallRiskScore: Math.round(Math.random() * 40 + 30) / 10,
        findings: [
          {
            title: "Potential bias in training data distribution",
            severity: "high",
            category: "bias",
            recommendation: "Conduct demographic parity analysis across protected attributes",
          },
          {
            title: "Insufficient model explainability documentation",
            severity: "medium",
            category: "transparency",
            recommendation: "Implement SHAP or LIME explanations for model outputs",
          },
          {
            title: "Data retention policy exceeds regulatory requirements",
            severity: "medium",
            category: "privacy",
            recommendation: "Review and align data retention with GDPR Article 5(1)(e)",
          },
          {
            title: "Missing adversarial robustness testing",
            severity: "high",
            category: "security",
            recommendation: "Conduct adversarial attack simulations and document resilience measures",
          },
        ],
        recommendations: [
          "Establish continuous monitoring for model drift",
          "Implement automated bias detection in the ML pipeline",
          "Create model cards for all production models",
          "Set up regular third-party audit schedule",
        ],
        complianceGaps: [
          { framework: "EU AI Act", gap: "Missing conformity assessment for high-risk classification", priority: "critical" },
          { framework: "NIST AI RMF", gap: "Incomplete GOVERN function documentation", priority: "high" },
          { framework: "ISO 42001", gap: "AI management system not fully implemented", priority: "medium" },
        ],
      },
      bias_scan: {
        summary: `Bias scan analysis for "${audit.title}"`,
        overallBiasScore: Math.round(Math.random() * 30 + 20) / 10,
        protectedAttributes: ["gender", "race", "age", "disability_status"],
        biasMetrics: {
          demographicParity: { score: 0.82, status: "warning", threshold: 0.9 },
          equalizedOdds: { score: 0.88, status: "acceptable", threshold: 0.85 },
          calibration: { score: 0.91, status: "good", threshold: 0.9 },
          predictiveParity: { score: 0.76, status: "critical", threshold: 0.85 },
        },
        findings: [
          {
            attribute: "gender",
            biasType: "disparate_impact",
            severity: "high",
            detail: "Female applicants receive 23% fewer positive outcomes than male applicants",
          },
          {
            attribute: "age",
            biasType: "indirect_discrimination",
            severity: "medium",
            detail: "Age proxy variables detected in feature set (years_experience, graduation_year)",
          },
        ],
        recommendations: [
          "Apply reweighting technique to training data",
          "Remove proxy variables for protected attributes",
          "Implement post-processing calibration",
          "Conduct intersectional bias analysis",
        ],
      },
      risk_assessment: {
        summary: `AI risk assessment for "${audit.title}"`,
        overallRiskLevel: "high",
        riskScore: Math.round(Math.random() * 30 + 50) / 10,
        riskCategories: [
          { category: "Bias & Fairness", score: 7.2, level: "high" },
          { category: "Safety & Reliability", score: 5.8, level: "medium" },
          { category: "Privacy & Data Protection", score: 6.5, level: "medium" },
          { category: "Security & Robustness", score: 8.1, level: "high" },
          { category: "Transparency & Explainability", score: 4.3, level: "medium" },
          { category: "Accountability & Governance", score: 5.1, level: "medium" },
        ],
        topRisks: [
          {
            risk: "Model outputs used for high-stakes decisions without human oversight",
            likelihood: 4,
            impact: 5,
            mitigation: "Implement mandatory human-in-the-loop for decisions affecting individuals",
          },
          {
            risk: "Training data contains personally identifiable information",
            likelihood: 3,
            impact: 4,
            mitigation: "Apply differential privacy and data anonymization techniques",
          },
          {
            risk: "No fallback mechanism when model confidence is low",
            likelihood: 4,
            impact: 3,
            mitigation: "Establish confidence thresholds and human escalation procedures",
          },
        ],
        recommendations: [
          "Establish AI risk governance committee",
          "Implement continuous model monitoring",
          "Create incident response plan for AI failures",
          "Conduct regular red team testing",
        ],
      },
      compliance_check: {
        summary: `Compliance check analysis for "${audit.title}"`,
        overallComplianceRate: Math.round(Math.random() * 30 + 55),
        frameworks: [
          {
            name: "EU AI Act",
            complianceRate: 62,
            status: "partial",
            gaps: [
              "Missing risk classification documentation",
              "Incomplete technical documentation per Article 11",
              "No conformity assessment procedure established",
            ],
          },
          {
            name: "NIST AI RMF",
            complianceRate: 71,
            status: "partial",
            gaps: [
              "MAP function: Incomplete AI use case inventory",
              "MEASURE function: Missing quantitative fairness metrics",
              "MANAGE function: No AI incident response plan",
            ],
          },
          {
            name: "ISO 42001",
            complianceRate: 48,
            status: "non_compliant",
            gaps: [
              "AI management system not established",
              "Missing AI policy and objectives",
              "No AI risk assessment methodology defined",
            ],
          },
        ],
        actionItems: [
          { action: "Complete AI system risk classification", priority: "critical", deadline: "30 days" },
          { action: "Develop technical documentation package", priority: "high", deadline: "60 days" },
          { action: "Establish conformity assessment procedure", priority: "high", deadline: "90 days" },
          { action: "Implement AI management system per ISO 42001", priority: "medium", deadline: "180 days" },
        ],
      },
    };

    const aiOutput = mockOutputs[analysisType] || mockOutputs["auto_audit"];
    const confidenceScore = Math.round((Math.random() * 20 + 75) * 100) / 100;

    const result = await prisma.aiAnalysisResult.create({
      data: {
        auditId,
        analysisType,
        inputData: JSON.stringify({
          auditTitle: audit.title,
          systemName: audit.systemName,
          systemType: audit.systemType,
          findingsCount: audit.findings.length,
          checklistsCount: audit.checklists.length,
          complianceChecksCount: audit.complianceChecks.length,
          analyzedAt: new Date().toISOString(),
        }),
        aiOutput: JSON.stringify(aiOutput),
        confidenceScore,
        reviewStatus: "pending",
      },
      include: {
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating AI analysis:", error);
    return NextResponse.json(
      { error: "Failed to create AI analysis" },
      { status: 500 }
    );
  }
}
