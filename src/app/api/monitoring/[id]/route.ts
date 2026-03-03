import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    const body = await request.json();

    const alert = await prisma.monitoringAlert.update({
      where: { id },
      data: {
        alertType: body.alertType,
        severity: body.severity,
        description: body.description,
        metricName: body.metricName,
        expectedValue: body.expectedValue,
        actualValue: body.actualValue,
        threshold: body.threshold,
        status: body.status,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Error updating monitoring alert:", error);
    return NextResponse.json(
      { error: "Failed to update monitoring alert" },
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

    await prisma.monitoringAlert.delete({ where: { id } });

    return NextResponse.json({
      message: "Monitoring alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting monitoring alert:", error);
    return NextResponse.json(
      { error: "Failed to delete monitoring alert" },
      { status: 500 }
    );
  }
}
