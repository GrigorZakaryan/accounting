import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { date, journalLines, description } = body;

  if (!date) return new NextResponse("Date is required!");

  if (!journalLines) return new NextResponse("Journal Lines is required!");

  await db.journalEntry.create({
    data: {
      date,
      description,
      journalLines: { createMany: { data: journalLines } },
    },
  });

  return new NextResponse("Journal Entry created successfully!");
};
