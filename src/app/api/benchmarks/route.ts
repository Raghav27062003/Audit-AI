import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry");

    const where: Record<string, unknown> = {};
    if (industry) where.industry = industry;

    const benchmarks = await prisma.benchmarkData.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(benchmarks);
  } catch (error) {
    console.error("Error fetching benchmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch benchmarks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const benchmark = await prisma.benchmarkData.create({
      data: {
        industry: body.industry,
        category: body.category,
        avgScore: body.avgScore,
        percentile25: body.percentile25,
        percentile50: body.percentile50,
        percentile75: body.percentile75,
        sampleSize: body.sampleSize ?? 0,
        period: body.period,
      },
    });

    return NextResponse.json(benchmark, { status: 201 });
  } catch (error) {
    console.error("Error creating benchmark:", error);
    return NextResponse.json(
      { error: "Failed to create benchmark" },
      { status: 500 }
    );
  }
}
