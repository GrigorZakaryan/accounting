import { formatCurrency } from "@/utils/currency";
import { db } from "@/lib/db";
import { Banknote, ChevronRight, Clock, ClockArrowDown } from "lucide-react";
import Link from "next/link";
import { PurchasesContent } from "./components/content";

export default async function PurchasesPage() {
  const invoices = await db.invoice.findMany({
    where: { type: "PURCHASE" },
    include: { vendor: true },
  });

  const suppliers = await db.party.findMany({ where: { type: "VENDOR" } });

  const formattedInvoices = invoices.map((invoice) => {
    return {
      ...invoice,
      tax: Number(invoice.tax),
      subtotal: Number(invoice.subtotal),
      total: Number(invoice.total),
    };
  });
  return (
    <div className="w-full h-full bg-muted">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <Link href={"/"}>
              <li className="text-sm font-medium opacity-80 cursor-pointer hover:opacity-100">
                Dashboard
              </li>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Purchases
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Purchases</h1>
            <p className="text-sm text-muted-foreground">
              Here you can explore all your purchase history.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="border p-5 bg-white rounded-2xl w-full my-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border">
                <Clock className="text-primary w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-md">
                  Pending{" "}
                  <span className="text-muted-foreground text-sm">
                    {"(To Pay)"}
                  </span>
                </h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(
                    invoices.reduce((acc, curr) => {
                      return (
                        acc +
                        (curr.status === "PENDING" ? Number(curr.total) : 0)
                      );
                    }, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-white rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border">
                <Banknote className="text-primary w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Paid</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(
                    invoices.reduce((acc, curr) => {
                      return (
                        acc + (curr.status === "PAID" ? Number(curr.total) : 0)
                      );
                    }, 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="border p-5 bg-white rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border">
                <ClockArrowDown className="text-primary w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Overdue</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(
                    invoices.reduce((acc, curr) => {
                      return (
                        acc +
                        (curr.status === "OVERDUE" ? Number(curr.total) : 0)
                      );
                    }, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <PurchasesContent invoices={formattedInvoices} suppliers={suppliers} />
      </div>
    </div>
  );
}
