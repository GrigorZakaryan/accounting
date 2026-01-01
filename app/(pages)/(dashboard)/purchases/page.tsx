import { formatCurrency } from "@/utils/currency";
import { db } from "@/lib/db";
import {
  Banknote,
  ChevronRight,
  Clock,
  ClockArrowDown,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { PurchasesContent } from "./components/content";
import { Button } from "@/components/ui/button";
import { SidebarMenu } from "@/components/sidebar-menu";
import { Header } from "../../components/header";

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
      <Header
        links={[
          { label: "Dashboard", link: "/overview" },
          { label: "Purchases" },
        ]}
      />
      <div className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Purchases</h1>
            <p className="text-sm text-muted-foreground">
              Here you can explore all your purchase history.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 w-full max-w-full overflow-x-auto">
          <div className="border p-5 bg-green-50 border-green-300 text-primary rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border bg-green-200 border-green-200">
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
          <div className="border p-5 bg-yellow-50 border-yellow-300 text-yellow-900 rounded-2xl w-full my-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-yellow-200 bg-yellow-200">
                <Clock className="text-yellow-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-md ">Pending </h3>
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

          <div className="border p-5 bg-red-50 border-red-300 text-red-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-red-200 bg-red-200">
                <ClockArrowDown className="text-red-700 w-7 h-7" />
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
        <PurchasesContent
          invoices={formattedInvoices}
          suppliers={suppliers}
          payments={formattedPayments}
        />
      </div>
    </div>
  );
}
