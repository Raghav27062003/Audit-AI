import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    const where: Record<string, unknown> = {};
    if (agentId) where.agentId = parseInt(agentId);

    const incidents = await prisma.agentIncident.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      include: {
        agent: { select: { id: true, agentName: true, agentType: true } },
      },
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error("Error fetching agent incidents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent incidents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const incident = await prisma.agentIncident.create({
      data: {
        agentId: body.agentId,
        incidentType: body.incidentType,
        severity: body.severity,
        description: body.description,
        rootCause: body.rootCause,
        resolution: body.resolution,
      },
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error("Error creating agent incident:", error);
    return NextResponse.json(
      { error: "Failed to create agent incident" },
      { status: 500 }
    );
  }
}
