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

    const test = await prisma.redTeamTest.update({
      where: { id },
      data: {
        testCategory: body.testCategory,
        testName: body.testName,
        testDescription: body.testDescription,
        testPrompts: body.testPrompts,
        results: body.results,
        passFail: body.passFail,
        severity: body.severity,
        runBy: body.runBy,
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error updating red team test:", error);
    return NextResponse.json(
      { error: "Failed to update red team test" },
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

    await prisma.redTeamTest.delete({ where: { id } });

    return NextResponse.json({ message: "Red team test deleted successfully" });
  } catch (error) {
    console.error("Error deleting red team test:", error);
    return NextResponse.json(
      { error: "Failed to delete red team test" },
      { status: 500 }
    );
  }
}
