import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const framework = searchParams.get("framework");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (framework) where.framework = framework;

    const templates = await prisma.template.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const template = await prisma.template.create({
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        framework: body.framework,
        content: body.content,
        isDefault: body.isDefault ?? false,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
