import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const audit = await prisma.audit.findUnique({
      where: { id },
      include: {
        findings: true,
        checklists: true,
        complianceChecks: true,
        remediations: true,
      },
    });

    if (!audit) {
      return NextResponse.json({ error: "Audit not found" }, { status: 404 });
    }

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Error fetching audit:", error);
    return NextResponse.json(
      { error: "Failed to fetch audit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    const audit = await prisma.audit.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        systemName: body.systemName,
        systemType: body.systemType,
        organization: body.organization,
        industry: body.industry,
        regions: body.regions,
        status: body.status,
        overallScore: body.overallScore,
        riskLevel: body.riskLevel,
        auditor: body.auditor,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        completionDate: body.completionDate
          ? new Date(body.completionDate)
          : undefined,
      },
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error("Error updating audit:", error);
    return NextResponse.json(
      { error: "Failed to update audit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    await prisma.audit.delete({ where: { id } });

    return NextResponse.json({ message: "Audit deleted successfully" });
  } catch (error) {
    console.error("Error deleting audit:", error);
    return NextResponse.json(
      { error: "Failed to delete audit" },
      { status: 500 }
    );
  }
}
