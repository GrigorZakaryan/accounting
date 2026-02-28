import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  },
) => {
  const { invoiceId } = await params;

  if (!invoiceId) {
    return new NextResponse("Missing Invoice ID", { status: 400 });
  }

  try {
    await db.invoice.delete({ where: { id: invoiceId } });
    return new NextResponse("Invoice Deleted Successfully!", { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err, { status: 500 });
  }
};
