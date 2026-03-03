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

    const remediation = await prisma.remediation.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: body.status,
        assignee: body.assignee,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        completedAt: body.completedAt
          ? new Date(body.completedAt)
          : undefined,
      },
    });

    return NextResponse.json(remediation);
  } catch (error) {
    console.error("Error updating remediation:", error);
    return NextResponse.json(
      { error: "Failed to update remediation" },
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

    await prisma.remediation.delete({ where: { id } });

    return NextResponse.json({ message: "Remediation deleted successfully" });
  } catch (error) {
    console.error("Error deleting remediation:", error);
    return NextResponse.json(
      { error: "Failed to delete remediation" },
      { status: 500 }
    );
  }
}
