import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");
    const framework = searchParams.get("framework");

    const where: Record<string, unknown> = {};
    if (auditId) where.auditId = parseInt(auditId);
    if (framework) where.framework = framework;

    const complianceChecks = await prisma.complianceCheck.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(complianceChecks);
  } catch (error) {
    console.error("Error fetching compliance checks:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance checks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const complianceCheck = await prisma.complianceCheck.create({
      data: {
        auditId: body.auditId,
        framework: body.framework,
        requirement: body.requirement,
        description: body.description,
        status: body.status ?? "pending",
        evidence: body.evidence,
        notes: body.notes,
        jurisdiction: body.jurisdiction,
      },
    });

    return NextResponse.json(complianceCheck, { status: 201 });
  } catch (error) {
    console.error("Error creating compliance check:", error);
    return NextResponse.json(
      { error: "Failed to create compliance check" },
      { status: 500 }
    );
  }
}
