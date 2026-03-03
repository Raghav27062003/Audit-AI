import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");
    const findingId = searchParams.get("findingId");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: Record<string, unknown> = {};
    if (auditId) where.auditId = parseInt(auditId);
    if (findingId) where.findingId = parseInt(findingId);
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const remediations = await prisma.remediation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
        finding: { select: { id: true, title: true, severity: true } },
      },
    });

    return NextResponse.json(remediations);
  } catch (error) {
    console.error("Error fetching remediations:", error);
    return NextResponse.json(
      { error: "Failed to fetch remediations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const remediation = await prisma.remediation.create({
      data: {
        auditId: body.auditId,
        findingId: body.findingId,
        title: body.title,
        description: body.description,
        priority: body.priority ?? "medium",
        status: body.status ?? "open",
        assignee: body.assignee,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completedAt: body.completedAt
          ? new Date(body.completedAt)
          : undefined,
      },
    });

    return NextResponse.json(remediation, { status: 201 });
  } catch (error) {
    console.error("Error creating remediation:", error);
    return NextResponse.json(
      { error: "Failed to create remediation" },
      { status: 500 }
    );
  }
}
