import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const finding = await prisma.finding.findUnique({
      where: { id },
      include: {
        audit: { select: { id: true, title: true } },
        remediations: true,
      },
    });

    if (!finding) {
      return NextResponse.json(
        { error: "Finding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(finding);
  } catch (error) {
    console.error("Error fetching finding:", error);
    return NextResponse.json(
      { error: "Failed to fetch finding" },
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

    const finding = await prisma.finding.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        severity: body.severity,
        status: body.status,
        evidence: body.evidence,
        recommendation: body.recommendation,
        aiGenerated: body.aiGenerated,
      },
    });

    return NextResponse.json(finding);
  } catch (error) {
    console.error("Error updating finding:", error);
    return NextResponse.json(
      { error: "Failed to update finding" },
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

    await prisma.finding.delete({ where: { id } });

    return NextResponse.json({ message: "Finding deleted successfully" });
  } catch (error) {
    console.error("Error deleting finding:", error);
    return NextResponse.json(
      { error: "Failed to delete finding" },
      { status: 500 }
    );
  }
}
