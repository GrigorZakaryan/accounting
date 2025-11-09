import { formatCurrency } from "@/utils/currency";
import { db } from "@/lib/db";
import { Banknote, ChevronRight, Clock, ClockArrowDown } from "lucide-react";
import Link from "next/link";

export default async function PurchasesPage() {
  const invoices = await db.invoice.findMany({
    where: { type: "PURCHASE" },
    include: { vendor: true, payments: true },
    orderBy: { issueDate: "asc" },
  });

  const suppliers = await db.party.findMany({ where: { type: "VENDOR" } });
  const payments = invoices.flatMap((invoice) => invoice.payments);

  const formattedInvoices = invoices.map((invoice) => {
    return {
      ...invoice,
      tax: Number(invoice.tax),
      subtotal: Number(invoice.subtotal),
      total: Number(invoice.total),
      payments: payments.map((payment) => ({
        ...payment,
        amount: Number(payment.amount),
      })),
    };
  });

  const formattedPayments = payments.map((payment) => ({
    ...payment,
    amount: Number(payment.amount),
  }));

  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <li className="text-sm font-medium hover:opacity-100">
              Accountability
            </li>

            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium hover:opacity-100">
              Chart of Accounts
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Chart of Accounts</h1>
            <p className="text-sm text-muted-foreground">
              Here you can manage all CoAs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
