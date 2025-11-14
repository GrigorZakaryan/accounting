import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { code, name, type } = body;

  if (!code) {
    return new NextResponse("Code is required!", { status: 400 });
  }

  if (!name) {
    return new NextResponse("Name is required!", { status: 400 });
  }

  const validTypes = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];
  if (!validTypes.includes(type)) {
    return new NextResponse("Type is invalid!", { status: 400 });
  }

  await db.chartAccount.create({ data: { code, name, type, isSystem: true } });

  return new NextResponse("CoA created successfully!");
};
