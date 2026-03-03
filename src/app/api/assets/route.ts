import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const governanceStatus = searchParams.get("governanceStatus");

    const where: Record<string, unknown> = {};
    if (governanceStatus) where.governanceStatus = governanceStatus;

    const assets = await prisma.aiAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { bomComponents: true } },
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching AI assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const asset = await prisma.aiAsset.create({
      data: {
        assetName: body.assetName,
        assetType: body.assetType,
        vendor: body.vendor,
        department: body.department,
        discoveredVia: body.discoveredVia ?? "manual",
        riskScore: body.riskScore,
        governanceStatus: body.governanceStatus ?? "unregistered",
        dataSensitivity: body.dataSensitivity,
        usersCount: body.usersCount ?? 0,
        lastActivity: body.lastActivity
          ? new Date(body.lastActivity)
          : undefined,
        notes: body.notes,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Error creating AI asset:", error);
    return NextResponse.json(
      { error: "Failed to create AI asset" },
      { status: 500 }
    );
  }
}
