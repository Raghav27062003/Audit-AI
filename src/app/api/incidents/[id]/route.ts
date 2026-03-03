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

    const incident = await prisma.incident.update({
      where: { id },
      data: {
        auditId: body.auditId,
        assetId: body.assetId,
        incidentType: body.incidentType,
        severity: body.severity,
        description: body.description,
        playbookUsed: body.playbookUsed,
        status: body.status,
        responders: body.responders,
        timeline: body.timeline,
        rootCause: body.rootCause,
        lessonsLearned: body.lessonsLearned,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error("Error updating incident:", error);
    return NextResponse.json(
      { error: "Failed to update incident" },
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

    await prisma.incident.delete({ where: { id } });

    return NextResponse.json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error);
    return NextResponse.json(
      { error: "Failed to delete incident" },
      { status: 500 }
    );
  }
}
