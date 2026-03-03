import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const vendors = await prisma.vendorAssessment.findMany({
      orderBy: { assessmentDate: "desc" },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Error fetching vendor assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor assessments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const vendor = await prisma.vendorAssessment.create({
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

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error("Error creating vendor assessment:", error);
    return NextResponse.json(
      { error: "Failed to create vendor assessment" },
      { status: 500 }
    );
  }
}
