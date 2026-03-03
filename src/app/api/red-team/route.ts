import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auditId = searchParams.get("auditId");
    const assetId = searchParams.get("assetId");

    const where: Record<string, unknown> = {};
    if (auditId) where.auditId = parseInt(auditId);
    if (assetId) where.assetId = parseInt(assetId);

    const tests = await prisma.redTeamTest.findMany({
      where,
      orderBy: { runDate: "desc" },
      include: {
        audit: { select: { id: true, title: true } },
        asset: { select: { id: true, assetName: true } },
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching red team tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch red team tests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const test = await prisma.redTeamTest.create({
      data: {
        auditId: body.auditId,
        assetId: body.assetId,
        testCategory: body.testCategory,
        testName: body.testName,
        testDescription: body.testDescription,
        testPrompts: body.testPrompts,
        results: body.results,
        passFail: body.passFail ?? "pending",
        severity: body.severity,
        runBy: body.runBy,
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("Error creating red team test:", error);
    return NextResponse.json(
      { error: "Failed to create red team test" },
      { status: 500 }
    );
  }
}
