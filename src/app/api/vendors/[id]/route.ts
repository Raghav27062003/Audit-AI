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

    const vendor = await prisma.vendorAssessment.update({
      where: { id },
      data: {
        vendorName: body.vendorName,
        vendorType: body.vendorType,
        riskScore: body.riskScore,
        complianceStatus: body.complianceStatus,
        contractExpiry: body.contractExpiry
          ? new Date(body.contractExpiry)
          : undefined,
        keyRisks: body.keyRisks,
        questionnaireResponses: body.questionnaireResponses,
        assessor: body.assessor,
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Error updating vendor assessment:", error);
    return NextResponse.json(
      { error: "Failed to update vendor assessment" },
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

    await prisma.vendorAssessment.delete({ where: { id } });

    return NextResponse.json({
      message: "Vendor assessment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vendor assessment:", error);
    return NextResponse.json(
      { error: "Failed to delete vendor assessment" },
      { status: 500 }
    );
  }
}
