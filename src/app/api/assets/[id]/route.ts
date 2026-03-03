import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    const asset = await prisma.aiAsset.findUnique({
      where: { id },
      include: {
        bomComponents: true,
        redTeamTests: true,
        monitoringAlerts: true,
        dataLineage: true,
        aiAgents: true,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "AI asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error fetching AI asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI asset" },
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

    const asset = await prisma.aiAsset.update({
      where: { id },
      data: {
        assetName: body.assetName,
        assetType: body.assetType,
        vendor: body.vendor,
        department: body.department,
        discoveredVia: body.discoveredVia,
        riskScore: body.riskScore,
        governanceStatus: body.governanceStatus,
        dataSensitivity: body.dataSensitivity,
        usersCount: body.usersCount,
        lastActivity: body.lastActivity
          ? new Date(body.lastActivity)
          : undefined,
        notes: body.notes,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error updating AI asset:", error);
    return NextResponse.json(
      { error: "Failed to update AI asset" },
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

    await prisma.aiAsset.delete({ where: { id } });

    return NextResponse.json({ message: "AI asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting AI asset:", error);
    return NextResponse.json(
      { error: "Failed to delete AI asset" },
      { status: 500 }
    );
  }
}
