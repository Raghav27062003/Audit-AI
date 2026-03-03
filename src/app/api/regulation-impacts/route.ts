import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");

    const where: Record<string, unknown> = {};
    if (auditId) where.auditId = parseInt(auditId);

    const impacts = await prisma.regulationImpact.findMany({
      where,
      orderBy: { priority: "asc" },
      include: {
        regulation: {
          select: {
            id: true,
            regulationName: true,
            country: true,
            effectiveDate: true,
          },
        },
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(impacts);
  } catch (error) {
    console.error("Error fetching regulation impacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch regulation impacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const impact = await prisma.regulationImpact.create({
      data: {
        regulationId: body.regulationId,
        auditId: body.auditId,
        impactType: body.impactType,
        requirementDescription: body.requirementDescription,
        currentStatus: body.currentStatus,
        actionNeeded: body.actionNeeded,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        priority: body.priority ?? "medium",
      },
    });

    return NextResponse.json(impact, { status: 201 });
  } catch (error) {
    console.error("Error creating regulation impact:", error);
    return NextResponse.json(
      { error: "Failed to create regulation impact" },
      { status: 500 }
    );
  }
}
