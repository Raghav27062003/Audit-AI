import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");

    const where = auditId ? { auditId: parseInt(auditId) } : {};

    const findings = await prisma.finding.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
        remediations: true,
      },
    });

    return NextResponse.json(findings);
  } catch (error) {
    console.error("Error fetching findings:", error);
    return NextResponse.json(
      { error: "Failed to fetch findings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const finding = await prisma.finding.create({
      data: {
        auditId: body.auditId,
        title: body.title,
        description: body.description,
        category: body.category,
        severity: body.severity,
        status: body.status ?? "open",
        evidence: body.evidence,
        recommendation: body.recommendation,
        aiGenerated: body.aiGenerated ?? false,
      },
    });

    return NextResponse.json(finding, { status: 201 });
  } catch (error) {
    console.error("Error creating finding:", error);
    return NextResponse.json(
      { error: "Failed to create finding" },
      { status: 500 }
    );
  }
}
