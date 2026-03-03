import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status ? { status } : {};

    const audits = await prisma.audit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            findings: true,
            checklists: true,
          },
        },
      },
    });

    return NextResponse.json(audits);
  } catch (error) {
    console.error("Error fetching audits:", error);
    return NextResponse.json(
      { error: "Failed to fetch audits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const audit = await prisma.audit.create({
      data: {
        title: body.title,
        description: body.description,
        systemName: body.systemName,
        systemType: body.systemType,
        organization: body.organization,
        industry: body.industry,
        regions: body.regions,
        status: body.status ?? "draft",
        overallScore: body.overallScore,
        riskLevel: body.riskLevel,
        auditor: body.auditor,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        completionDate: body.completionDate
          ? new Date(body.completionDate)
          : undefined,
      },
    });

    return NextResponse.json(audit, { status: 201 });
  } catch (error) {
    console.error("Error creating audit:", error);
    return NextResponse.json(
      { error: "Failed to create audit" },
      { status: 500 }
    );
  }
}
