import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const agent = await prisma.aiAgent.findUnique({
      where: { id },
      include: {
        asset: { select: { id: true, assetName: true, assetType: true } },
        agentIncidents: {
          orderBy: { occurredAt: "desc" },
        },
      },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "AI agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error fetching AI agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI agent" },
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

    const agent = await prisma.aiAgent.update({
      where: { id },
      data: {
        assetId: body.assetId,
        agentName: body.agentName,
        agentType: body.agentType,
        description: body.description,
        autonomyLevel: body.autonomyLevel,
        toolsAccess: body.toolsAccess,
        dataAccess: body.dataAccess,
        riskScore: body.riskScore,
        governanceStatus: body.governanceStatus,
        owner: body.owner,
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error("Error updating AI agent:", error);
    return NextResponse.json(
      { error: "Failed to update AI agent" },
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

    await prisma.aiAgent.delete({ where: { id } });

    return NextResponse.json({ message: "AI agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI agent:", error);
    return NextResponse.json(
      { error: "Failed to delete AI agent" },
      { status: 500 }
    );
  }
}
