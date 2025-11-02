import { db } from "@/lib/db";
import { inputSupplierSchema } from "@/schemas/supplier-schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { supplierData } = body;

  const validatedInputSupplier = inputSupplierSchema.safeParse(supplierData);

  if (!validatedInputSupplier.success) {
    console.error(validatedInputSupplier.error);
    return new NextResponse("Invalid Request Data", { status: 400 });
  }

  await db.party.create({
    data: { ...supplierData, businessId: "123", type: "VENDOR" },
  });

  return new NextResponse("Supplier created succesfully!", { status: 200 });
};
