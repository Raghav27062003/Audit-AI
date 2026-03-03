import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const approvals = await prisma.approvalWorkflow.findMany({
      where,
      orderBy: { requestedAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(approvals);
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const approval = await prisma.approvalWorkflow.create({
      data: {
        entityType: body.entityType,
        entityId: body.entityId,
        auditId: body.auditId,
        requestedBy: body.requestedBy,
        approvedBy: body.approvedBy,
        status: body.status ?? "pending",
        notes: body.notes,
      },
    });

    return NextResponse.json(approval, { status: 201 });
  } catch (error) {
    console.error("Error creating approval:", error);
    return NextResponse.json(
      { error: "Failed to create approval" },
      { status: 500 }
    );
  }
}
