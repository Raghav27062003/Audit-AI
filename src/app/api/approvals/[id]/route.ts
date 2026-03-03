import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    const approval = await prisma.approvalWorkflow.update({
      where: { id },
      data: {
        status: body.status,
        approvedBy: body.approvedBy,
        notes: body.notes,
        resolvedAt: body.status === "approved" || body.status === "rejected"
          ? new Date()
          : undefined,
      },
    });

    return NextResponse.json(approval);
  } catch (error) {
    console.error("Error updating approval:", error);
    return NextResponse.json(
      { error: "Failed to update approval" },
      { status: 500 }
    );
  }
}
