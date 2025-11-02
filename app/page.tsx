import { bankBalance, equityCapital, netWorth } from "@/formulas/formulas";
import { formatCurrency } from "@/utils/currency";
import { HandCoins, Landmark, Scale } from "lucide-react";

export default async function Page() {
  return (
    <main className="bg-muted w-full h-full">
      <header className="w-full h-16 bg-white border-b">
        <div className="flex flex-col justify-center w-full h-full px-5 text-primary">
          <ul className="flex items-center gap-3">
            <li className="text-sm font-medium cursor-pointer hover:opacity-100">
              Dashboard
            </li>
          </ul>
        </div>
      </header>
      <div className="px-5 pt-5 w-full">
        <div className="flex items-center w-full gap-5 px-3">
          <div className="w-full border rounded-2xl bg-white text-primary p-4 shadow">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-md">
                <Landmark className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Bank Balance</h3>
            </div>
            <h1 className="text-2xl font-medium mt-3">
              {formatCurrency(await bankBalance()) ?? 0}
            </h1>
          </div>
          <div className="w-full border rounded-2xl bg-white text-primary p-4 shadow">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-md">
                <HandCoins className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Net Worth</h3>
            </div>
            <h1 className="text-2xl font-medium mt-3">
              {formatCurrency((await netWorth()) ?? 0)}
            </h1>
          </div>
          <div className="w-full border rounded-2xl bg-white text-primary p-4 shadow">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-md">
                <Scale className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Equity Capital</h3>
            </div>
            <h1 className="text-2xl font-medium mt-3">
              {formatCurrency((await equityCapital()) ?? 0)}
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
