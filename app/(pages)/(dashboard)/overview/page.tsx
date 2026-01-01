import { QuickActions } from "@/components/overview/quick-actions";
import { RecentTransactions } from "@/components/overview/recent-transactions";
import { db } from "@/lib/db";
import { formatCurrency } from "@/utils/currency";
import { ChevronRight, Landmark, ShoppingCart, Tag } from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const journalEntries = await db.journalEntry.findMany({
    orderBy: { date: "desc" },
  });
  const bank_account = await db.chartAccount.findUnique({
    where: { code: "1020" },
    include: { journalLines: true },
  });
  const bank =
    bank_account?.journalLines.reduce((acc, curr) => {
      if (curr.type === "DEBIT") {
        return acc + curr.amount;
      }
      return acc - curr.amount;
    }, 0) ?? 0;

  const purchases = await db.invoice.findMany({ where: { type: "PURCHASE" } });
  const purchases_total = purchases.reduce(
    (acc, curr) => Number(acc) + Number(curr.total),
    0
  );
  const sales = await db.invoice.findMany({ where: { type: "SALE" } });
  const sales_total = sales.reduce(
    (acc, curr) => Number(acc) + Number(curr.total),
    0
  );

  return (
    <div className="bg-muted w-full h-full">
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
              Overview
            </li>
          </ul>
        </div>
      </header>
      <main className="p-5 overflow-y-auto h-full pb-20">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-muted-foreground">
              Here you can explore all your activites.
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 lg:gap-5 w-full mt-3 lg:mt-0 max-w-full overflow-x-auto">
          <div className="border p-5 bg-blue-50 border-blue-300 text-blue-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-blue-200 bg-blue-200">
                <Landmark className="text-blue-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Bank Account</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(bank)}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-green-50 border-green-300 text-primary rounded-2xl w-full my-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-green-200 bg-green-200">
                <ShoppingCart className="text-green-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-md ">Total Purchases</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(purchases_total)}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-red-50 border-red-300 text-red-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border bg-red-200 border-red-200">
                <Tag className="w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Total Sales</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(sales_total)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-5 lg:mt-0">
            <h1 className="font-medium text-lg">Activity</h1>
            <p className="text-sm text-muted-foreground">
              View your recent activity.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <RecentTransactions journalEntries={journalEntries} />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}
