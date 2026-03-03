import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");

    const where = auditId ? { auditId: parseInt(auditId) } : {};

    const checklists = await prisma.checklistItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(checklists);
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return NextResponse.json(
      { error: "Failed to fetch checklists" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const checklistItem = await prisma.checklistItem.create({
      data: {
        auditId: body.auditId,
        category: body.category,
        framework: body.framework,
        question: body.question,
        status: body.status ?? "not_started",
        score: body.score,
        evidence: body.evidence,
        notes: body.notes,
        aiSuggested: body.aiSuggested ?? false,
      },
    });

    return NextResponse.json(checklistItem, { status: 201 });
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return NextResponse.json(
      { error: "Failed to create checklist item" },
      { status: 500 }
    );
  }
}
