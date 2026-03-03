import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const agents = await prisma.aiAgent.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        asset: { select: { id: true, assetName: true } },
        _count: { select: { agentIncidents: true } },
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching AI agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI agents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const agent = await prisma.aiAgent.create({
      data: {
        assetId: body.assetId,
        agentName: body.agentName,
        agentType: body.agentType,
        description: body.description,
        autonomyLevel: body.autonomyLevel ?? "human_in_loop",
        toolsAccess: body.toolsAccess,
        dataAccess: body.dataAccess,
        riskScore: body.riskScore,
        governanceStatus: body.governanceStatus ?? "provisional",
        owner: body.owner,
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating AI agent:", error);
    return NextResponse.json(
      { error: "Failed to create AI agent" },
      { status: 500 }
    );
  }
}
