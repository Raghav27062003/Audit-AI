import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await prisma.monitoringAlert.findMany({
      where,
      orderBy: { triggeredAt: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
        asset: { select: { id: true, assetName: true } },
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Error fetching monitoring alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch monitoring alerts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const alert = await prisma.monitoringAlert.create({
      data: {
        auditId: body.auditId,
        assetId: body.assetId,
        alertType: body.alertType,
        severity: body.severity,
        description: body.description,
        metricName: body.metricName,
        expectedValue: body.expectedValue,
        actualValue: body.actualValue,
        threshold: body.threshold,
        status: body.status ?? "active",
      },
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error("Error creating monitoring alert:", error);
    return NextResponse.json(
      { error: "Failed to create monitoring alert" },
      { status: 500 }
    );
  }
}
