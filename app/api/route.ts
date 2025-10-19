import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const {
    operationType,
    assetCategory,
    liabilityCategory,
    quantity,
    amount,
    name,
  } = body;

  if (operationType === "INVESTMENT") {
  }

  if (operationType === "PURCHASE") {
  }

  if (operationType === "SALE") {
  }

  if (operationType === "LOAN_RECIEVEMENT") {
  }

  if (operationType === "LOAN_PAYMENT") {
  }

  return new NextResponse("Success!");
};
