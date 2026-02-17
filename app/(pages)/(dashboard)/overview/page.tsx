import { QuickActions } from "@/components/overview/quick-actions";
import {
  RecentTransactions,
  RecentTransactionsMobile,
} from "@/components/overview/recent-transactions";
import { db } from "@/lib/db";
import { convertIntToDecimal, formatCurrency } from "@/utils/currency";
import { BellRing, Landmark, Menu, ShoppingCart, Tag } from "lucide-react";
import { Header } from "../../components/header";
import { QuickActionsMobile } from "./components/mobile-quick-actions";

export default async function Page() {
  const journalEntries = await db.journalEntry.findMany({
    orderBy: { date: "desc" },
  });
  const bank_account = await db.chartAccount.findUnique({
    where: { code: "08.01" },
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
  const purchases_total = purchases.reduce((acc, curr) => acc + curr.total, 0);
  const sales = await db.invoice.findMany({ where: { type: "SALE" } });
  const sales_total = sales.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="w-full h-full bg-green-400 md:bg-muted">
      <div className="hidden md:block">
        <Header links={[{ label: "Overview" }]} />
      </div>
      <main className="md:p-5 overflow-y-auto h-full md:pb-20">
        <div className="hidden md:flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-semibold">Overview</h1>
            <p className="text-sm text-muted-foreground">
              Here you can explore all your activites.
            </p>
          </div>
        </div>
        <div className="hidden md:flex justify-between items-center gap-2 lg:gap-5 w-full mt-3 lg:mt-0 max-w-full overflow-x-auto">
          <div className="border p-5 bg-blue-50 border-blue-300 text-blue-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-blue-200 bg-blue-200">
                <Landmark className="text-blue-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Bank Account</h3>
                <span className="text-3xl font-semibold">
                  {formatCurrency(convertIntToDecimal(bank))}
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
                  {formatCurrency(convertIntToDecimal(purchases_total))}
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
                  {formatCurrency(convertIntToDecimal(sales_total))}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden flex flex-col items-center justify-between min-h-[45dvh] bg-gradient-to-t from-green-400 via-green-200 to-white p-5 pb-16">
          <div className="flex items-center justify-between w-full">
            <div className="p-3 bg-white rounded-full border">
              <Menu />
            </div>
            <p className="text-md text-green-800 text-center font-medium">
              Bank Account
            </p>
            <div className="p-3 bg-white rounded-full border">
              <BellRing />
            </div>
          </div>
          <div>
            <div className="flex flex-col items-center gap-3">
              <h1 className="text-center font-bold text-green-950 text-5xl">
                {formatCurrency(convertIntToDecimal(bank))}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <div className="w-3 h-3 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white/70" />
            <div className="w-2 h-2 rounded-full bg-white/70" />
          </div>
        </div>
        <div className="w-full h-full fixed overflow-y-auto md:hidden bottom-0 max-h-[60dvh] bg-muted rounded-t-4xl p-5">
          <QuickActionsMobile />
          <RecentTransactionsMobile journalEntries={journalEntries} />
        </div>
        <div className="hidden md:block rounded-t-2xl w-full bg-muted">
          <div className="hidden md:block mt-5 lg:mt-0">
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
