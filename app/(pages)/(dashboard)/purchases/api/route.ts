import { db } from "@/lib/db";
import { Invoice, Payment } from "@/lib/generated/prisma";
import { fullPurchaseInvoiceSchema } from "@/schemas/invoice-schema";
import { NextRequest, NextResponse } from "next/server";
import { convertDecimalToInt } from "@/utils/currency";
import { InvoiceItem } from "@/types/purchases";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const {
    invoice,
    items,
    payments,
  }: {
    invoice: Invoice;
    items: InvoiceItem[];
    payments: Payment[];
  } = body;

  console.log(body);

  // CALCULATE TAXED AMOUNT
  const taxedAmount = items.reduce(
    (acc, curr) => acc + Number(curr.subtotal) * (curr.tax / 100),
    0,
  );

  // CONVERT STRING TO ACTUALT DATETIME
  const formattedInvoice = {
    ...invoice,
    issueDate: new Date(invoice.issueDate),
    dueDate: invoice.dueDate && new Date(invoice.dueDate),
  };

  // VALIDATE INVOICE FIELDS
  const invoiceParsed = fullPurchaseInvoiceSchema.safeParse(formattedInvoice);

  if (!invoiceParsed.success) {
    console.error("Invoice fields are Invalid");
    return NextResponse.json(
      { errors: invoiceParsed.error.flatten() },
      { status: 400 },
    );
  }

  // CREATE THE INVOICE
  const createdInvoice = await db.invoice.create({
    data: {
      ...invoice,
      type: "PURCHASE",
      businessId: "123",
      total: convertDecimalToInt(Number(invoice.total)),
      subtotal: convertDecimalToInt(Number(invoice.subtotal)),
      items: {
        create: items.map((item) => ({
          description: item.description,
          total: convertDecimalToInt(item.total),
          subtotal: convertDecimalToInt(Number(item.subtotal)),
          quantity: Number(item.quantity),
          discounts: {
            create: item.discounts?.map((d) => ({
              ...d,
              value: Number(d.value),
            })),
          },
          tax: Number(item.tax),
          chartAccountId: item.chartAccountId,
          unitPrice: convertDecimalToInt(Number(item.unitPrice)),
        })),
      },
      payments: { createMany: { data: payments } },
    },
  });

  const taxCoA = await db.chartAccount.findUnique({ where: { code: "06.03" } });
  const debtsCoA = await db.chartAccount.findUnique({
    where: { code: "14.01" },
  });

  if (!taxCoA || !debtsCoA) {
    return new NextResponse("CoAs not found!", { status: 500 });
  }

  // CREATE THE JOURNAL ENTRY
  const accounts = items.map((item) => ({
    chartAccountId: item.chartAccountId,
    type: "DEBIT" as const,
    amount: convertDecimalToInt(Number(item.subtotal)),
    description: item.description,
  }));

  const lines = [
    ...accounts,
    {
      chartAccountId: taxCoA.id,
      type: "DEBIT" as const,
      amount: convertDecimalToInt(taxedAmount),
      description: "",
    },
    {
      chartAccountId: debtsCoA.id,
      type: "CREDIT" as const,
      amount: convertDecimalToInt(Number(invoice.total)),
      description: "",
    },
  ];

  await db.journalEntry.create({
    data: {
      date: new Date(createdInvoice.issueDate),
      description: `Purchase Invoice: INV-${createdInvoice.number}`,
      invoiceId: createdInvoice.id,
      journalLines: {
        createMany: {
          data: lines,
        },
      },
    },
  });

  // RETURN THE RESPONSE
  return new NextResponse("Invoice created succesfully!");
};
