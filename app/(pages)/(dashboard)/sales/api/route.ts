import { db } from "@/lib/db";
import { Invoice, Party, Payment } from "@/lib/generated/prisma";
import { fullSaleInvoiceSchema } from "@/schemas/invoice-schema";
import { InvoiceItem } from "@/types/purchases";
import { convertDecimalToInt } from "@/utils/currency";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const {
    invoice,
    items,
    payments,
  }: {
    invoice: Invoice;
    customer: Party | null;
    items: InvoiceItem[];
    payments: Payment[];
  } = body;

  console.log(body);

  // CALCULATE TAXED AMOUNT
  const taxedAmount = items.reduce(
    (acc, curr) => acc + Number(curr.subtotal) * (curr.tax / 100),
    0,
  );

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
      { status: 400 },
    );
  }

  const createdInvoice = await db.invoice.create({
    data: {
      ...invoice,
      type: "SALE",
      businessId: "123",
      total: convertDecimalToInt(Number(invoice.total)),
      subtotal: convertDecimalToInt(Number(invoice.subtotal)),
      items: {
        create: items.map((item) => ({
          description: item.description,
          total: convertDecimalToInt(item.total),
          subtotal: convertDecimalToInt(item.subtotal),
          quantity: Number(item.quantity),
          discounts: {
            create: item.discounts.map((d) => ({
              ...d,
              value: Number(d.value),
            })),
          },
          tax: Number(item.tax),
          chartAccountId: item.chartAccountId,
          unitPrice: convertDecimalToInt(item.unitPrice),
        })),
      },

      payments: { createMany: { data: payments } },
    },
  });

  const taxCoA = await db.chartAccount.findUnique({ where: { code: "15.03" } });
  const creditsCoA = await db.chartAccount.findUnique({
    where: { code: "05.01" },
  });

  if (!taxCoA || !creditsCoA) {
    return new NextResponse("CoAs not found!", { status: 500 });
  }

  // CREATE THE JOURNAL ENTRY
  const accounts = items.map((item) => ({
    chartAccountId: item.chartAccountId,
    type: "CREDIT" as const,
    amount: convertDecimalToInt(Number(item.subtotal)),
    description: item.description,
  }));

  const lines = [
    ...accounts,
    {
      chartAccountId: taxCoA.id,
      type: "CREDIT" as const,
      amount: convertDecimalToInt(taxedAmount),
      description: "",
    },
    {
      chartAccountId: creditsCoA.id,
      type: "DEBIT" as const,
      amount: convertDecimalToInt(Number(invoice.total)),
      description: "",
    },
  ];

  await db.journalEntry.create({
    data: {
      date: new Date(createdInvoice.issueDate),
      description: `Sale Invoice: INV-${createdInvoice.number}`,
      invoiceId: createdInvoice.id,
      journalLines: {
        createMany: {
          data: lines,
        },
      },
    },
  });

  return new NextResponse("Invoice created succesfully!");
};
