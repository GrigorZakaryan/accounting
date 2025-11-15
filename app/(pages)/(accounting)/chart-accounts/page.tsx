import { formatCurrency } from "@/utils/currency";
import { db } from "@/lib/db";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChevronRight,
  FileDown,
  HandCoins,
  Scale,
} from "lucide-react";
import { CoAContent } from "./components/content";

export default async function ChartAccountsPage() {
  const CoAs = await db.chartAccount.findMany({ orderBy: { code: "asc" } });

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

        <div className="grid grid-cols-5 items-center gap-3 w-full">
          <div className="border p-5 bg-cyan-50 border-cyan-300 text-primary rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border bg-cyan-200 border-cyan-200">
                <HandCoins className="text-primary w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Assets</h3>
                <span className="text-3xl font-semibold">
                  {CoAs.filter((CoA) => CoA.type === "ASSET").length}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-amber-50 border-amber-300 text-amber-900 rounded-2xl w-full my-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-amber-200 bg-amber-200">
                <FileDown className="text-amber-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-md ">Liabilites</h3>
                <span className="text-3xl font-semibold">
                  {CoAs.filter((CoA) => CoA.type === "LIABILITY").length}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-violet-50 border-violet-300 text-violet-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-violet-200 bg-violet-200">
                <Scale className="text-violet-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Equity</h3>
                <span className="text-3xl font-semibold">
                  {CoAs.filter((CoA) => CoA.type === "EQUITY").length}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-red-50 border-red-300 text-red-700 rounded-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border bg-red-200 border-red-200">
                <BanknoteArrowDown className="text-red-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="">Expense</h3>
                <span className="text-3xl font-semibold">
                  {CoAs.filter((CoA) => CoA.type === "EXPENSE").length}
                </span>
              </div>
            </div>
          </div>
          <div className="border p-5 bg-green-50 border-green-300 text-green-900 rounded-2xl w-full my-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full border border-green-200 bg-green-200">
                <BanknoteArrowUp className="text-green-700 w-7 h-7" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-md ">Income</h3>
                <span className="text-3xl font-semibold">
                  {CoAs.filter((CoA) => CoA.type === "INCOME").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CoAContent CoAs={CoAs} />
      </div>
    </div>
  );
}
