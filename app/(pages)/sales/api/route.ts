import { db } from "@/lib/db";
import { Invoice, InvoiceItem, Party, Payment } from "@/lib/generated/prisma";
import {
  fullPurchaseInvoiceSchema,
  fullSaleInvoiceSchema,
} from "@/schemas/invoice-schema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const {
    invoice,
    customer,
    items,
    payments,
  }: {
    invoice: Invoice;
    customer: Party | null;
    items: InvoiceItem[];
    payments: Payment[];
  } = body;

  console.log(body);

  const formattedInvoice = {
    ...invoice,
    issueDate: new Date(invoice.issueDate),
    dueDate: invoice.dueDate && new Date(invoice.dueDate),
  };

  const invoiceParsed = fullSaleInvoiceSchema.safeParse(formattedInvoice);

  if (!invoiceParsed.success) {
    console.error("Invoice fields are Invalid");
    return NextResponse.json(
      { errors: invoiceParsed.error.flatten() },
      { status: 400 }
    );
  }

  await db.invoice.create({
    data: {
      ...invoice,
      type: "SALE",
      businessId: "123",
      items: { createMany: { data: items } },
      payments: { createMany: { data: payments } },
    },
  });

  return new NextResponse("Invoice created succesfully!");
};
