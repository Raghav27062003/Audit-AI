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

    const risk = await prisma.riskRegister.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        likelihood: body.likelihood,
        impact: body.impact,
        riskScore: body.riskScore,
        status: body.status,
        owner: body.owner,
        mitigationPlan: body.mitigationPlan,
        relatedAuditId: body.relatedAuditId,
      },
    });

    return NextResponse.json(risk);
  } catch (error) {
    console.error("Error updating risk:", error);
    return NextResponse.json(
      { error: "Failed to update risk" },
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

    await prisma.riskRegister.delete({ where: { id } });

    return NextResponse.json({ message: "Risk deleted successfully" });
  } catch (error) {
    console.error("Error deleting risk:", error);
    return NextResponse.json(
      { error: "Failed to delete risk" },
      { status: 500 }
    );
  }
}
