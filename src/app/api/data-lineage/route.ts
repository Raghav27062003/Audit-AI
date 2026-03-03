import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");

    const where: Record<string, unknown> = {};
    if (assetId) where.assetId = parseInt(assetId);

    const lineage = await prisma.dataLineage.findMany({
      where,
      include: {
        asset: { select: { id: true, assetName: true, assetType: true } },
      },
    });

    return NextResponse.json(lineage);
  } catch (error) {
    console.error("Error fetching data lineage:", error);
    return NextResponse.json(
      { error: "Failed to fetch data lineage" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const node = await prisma.dataLineage.create({
      data: {
        assetId: body.assetId,
        nodeName: body.nodeName,
        nodeType: body.nodeType,
        upstreamNodes: body.upstreamNodes,
        downstreamNodes: body.downstreamNodes,
        dataTypes: body.dataTypes,
        sensitivityLevel: body.sensitivityLevel,
        consentStatus: body.consentStatus,
        retentionPolicy: body.retentionPolicy,
      },
    });

    return NextResponse.json(node, { status: 201 });
  } catch (error) {
    console.error("Error creating data lineage node:", error);
    return NextResponse.json(
      { error: "Failed to create data lineage node" },
      { status: 500 }
    );
  }
}
