import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");

    const where: Record<string, unknown> = {};
    if (assetId) where.assetId = parseInt(assetId);

    const components = await prisma.aiBomComponent.findMany({
      where,
      orderBy: { lastUpdated: "desc" },
      include: {
        asset: { select: { id: true, assetName: true, assetType: true } },
      },
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error("Error fetching BOM components:", error);
    return NextResponse.json(
      { error: "Failed to fetch BOM components" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const component = await prisma.aiBomComponent.create({
      data: {
        assetId: body.assetId,
        componentName: body.componentName,
        componentType: body.componentType,
        version: body.version,
        vendor: body.vendor,
        licenseType: body.licenseType,
        riskNotes: body.riskNotes,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error("Error creating BOM component:", error);
    return NextResponse.json(
      { error: "Failed to create BOM component" },
      { status: 500 }
    );
  }
}
