import { ChevronRight, CreditCard, FileText } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { PaymentForm } from "./components/payment-form";
import { convertIntToDecimal } from "@/utils/currency";

export default async function SalePaymentPage() {
  const invoices = await db.invoice.findMany({
    where: { type: "SALE" },
    include: {
      customer: true,
      payments: true,
      items: { include: { discounts: true } },
    },
  });

  const formattedInvoices = invoices.map((invoice) => ({
    ...invoice,
    subtotal: convertIntToDecimal(Number(invoice.subtotal)),
    total: convertIntToDecimal(Number(invoice.total)),
    payments: invoice.payments.map((payment) => ({
      ...payment,
      amount: convertIntToDecimal(Number(payment.amount)),
    })),
  }));
  return (
    <div className="w-full h-full bg-muted overflow-y-scroll">
      <header className="w-full h-16 bg-white border-b fixed">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <Link href={"/"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Dashboard
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={"/sales"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Sales
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Record Payment
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 pt-20">
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CreditCard className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold text-primary">
              Record Payment
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to record a new payment.
          </p>
        </div>
      </div>
      <div className="px-5 pb-10">
        <PaymentForm invoices={formattedInvoices} />
      </div>
    </div>
  );
}
