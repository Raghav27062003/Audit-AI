import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const assessments = await prisma.maturityAssessment.findMany({
      orderBy: { assessmentDate: "desc" },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("Error fetching maturity assessments:", error);
    return NextResponse.json(
      { error: "Failed to fetch maturity assessments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const assessment = await prisma.maturityAssessment.create({
      data: {
        dimension: body.dimension,
        questionId: body.questionId,
        questionText: body.questionText,
        maturityLevel: body.maturityLevel,
        evidence: body.evidence,
        overallScore: body.overallScore,
        assessedBy: body.assessedBy,
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("Error creating maturity assessment:", error);
    return NextResponse.json(
      { error: "Failed to create maturity assessment" },
      { status: 500 }
    );
  }
}
