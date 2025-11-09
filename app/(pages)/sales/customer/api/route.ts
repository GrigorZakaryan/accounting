import { db } from "@/lib/db";
import { inputCustomerSchema } from "@/schemas/customer-schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { customerData } = body;

  const validatedInputSupplier = inputCustomerSchema.safeParse(customerData);

  if (!validatedInputSupplier.success) {
    console.error(validatedInputSupplier.error);
    return new NextResponse("Invalid Request Data", { status: 400 });
  }

  await db.party.create({
    data: { ...customerData, businessId: "123", type: "CUSTOMER" },
  });

  return new NextResponse("Customer created succesfully!", { status: 200 });
};
