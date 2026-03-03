import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const scans = await prisma.aiAssetScan.findMany({
      orderBy: { scanDate: "desc" },
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error("Error fetching asset scans:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset scans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const scan = await prisma.aiAssetScan.create({
      data: {
        scanType: body.scanType,
        scanDate: body.scanDate ? new Date(body.scanDate) : undefined,
        toolsDiscovered: body.toolsDiscovered ?? 0,
        newTools: body.newTools ?? 0,
        riskAlerts: body.riskAlerts ?? 0,
        scanStatus: body.scanStatus ?? "in_progress",
      },
    });

    return NextResponse.json(scan, { status: 201 });
  } catch (error) {
    console.error("Error creating asset scan:", error);
    return NextResponse.json(
      { error: "Failed to create asset scan" },
      { status: 500 }
    );
  }
}
