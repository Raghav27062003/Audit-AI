import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const risks = await prisma.riskRegister.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(risks);
  } catch (error) {
    console.error("Error fetching risks:", error);
    return NextResponse.json(
      { error: "Failed to fetch risks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const risk = await prisma.riskRegister.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        likelihood: body.likelihood,
        impact: body.impact,
        riskScore: body.riskScore ?? body.likelihood * body.impact,
        status: body.status ?? "identified",
        owner: body.owner,
        mitigationPlan: body.mitigationPlan,
        relatedAuditId: body.relatedAuditId,
      },
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error("Error creating risk:", error);
    return NextResponse.json(
      { error: "Failed to create risk" },
      { status: 500 }
    );
  }
}
