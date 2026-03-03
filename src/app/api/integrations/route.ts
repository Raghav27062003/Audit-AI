import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const integrations = await prisma.integration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(integrations);
  } catch (error) {
    console.error("Error fetching integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const integration = await prisma.integration.create({
      data: {
        integrationType: body.integrationType,
        config: body.config,
        status: body.status ?? "inactive",
        lastSync: body.lastSync ? new Date(body.lastSync) : undefined,
        createdBy: body.createdBy,
      },
    });

    return NextResponse.json(integration, { status: 201 });
  } catch (error) {
    console.error("Error creating integration:", error);
    return NextResponse.json(
      { error: "Failed to create integration" },
      { status: 500 }
    );
  }
}
