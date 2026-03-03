import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");

    const where: Record<string, unknown> = {};
    if (country) where.country = country;

    const updates = await prisma.regulatoryUpdate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { regulationImpacts: true } },
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching regulatory updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch regulatory updates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const update = await prisma.regulatoryUpdate.create({
      data: {
        country: body.country,
        region: body.region,
        regulationName: body.regulationName,
        description: body.description,
        effectiveDate: body.effectiveDate
          ? new Date(body.effectiveDate)
          : undefined,
        impactLevel: body.impactLevel,
        affectedCategories: body.affectedCategories,
        sourceUrl: body.sourceUrl,
        status: body.status ?? "proposed",
      },
    });

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    console.error("Error creating regulatory update:", error);
    return NextResponse.json(
      { error: "Failed to create regulatory update" },
      { status: 500 }
    );
  }
}
