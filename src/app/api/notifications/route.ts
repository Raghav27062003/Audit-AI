import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const rules = await prisma.notificationRule.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Error fetching notification rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rule = await prisma.notificationRule.create({
      data: {
        triggerEvent: body.triggerEvent,
        conditions: body.conditions,
        recipients: body.recipients,
        channel: body.channel ?? "in_app",
        frequency: body.frequency ?? "immediate",
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    console.error("Error creating notification rule:", error);
    return NextResponse.json(
      { error: "Failed to create notification rule" },
      { status: 500 }
    );
  }
}
