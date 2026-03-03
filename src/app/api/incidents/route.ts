import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: { reportedAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
        asset: { select: { id: true, assetName: true } },
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const incident = await prisma.incident.create({
      data: {
        auditId: body.auditId,
        assetId: body.assetId,
        incidentType: body.incidentType,
        severity: body.severity,
        description: body.description,
        playbookUsed: body.playbookUsed,
        status: body.status ?? "detected",
        responders: body.responders,
        timeline: body.timeline,
        rootCause: body.rootCause,
        lessonsLearned: body.lessonsLearned,
        resolvedAt: body.resolvedAt ? new Date(body.resolvedAt) : undefined,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error("Error creating incident:", error);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
}
