"use client";

import { Asset, Liability } from "@/lib/generated/prisma";
import {
  assetsCategories,
  liabilitiesAllowedCategories,
  liabilityCategories,
  SingleOperationProps,
} from "@/operations";
import React from "react";

export const BalanceSheet = ({
  allOperations,
  assets,
  liabilities,
}: {
  allOperations?: SingleOperationProps[];
  assets: Asset[];
  liabilities: Liability[];
}) => {
  const currency = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);

  const assetsRenderCategory = (title: string) => (
    <div key={title} className="flex flex-col text-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <h4 className="font-semibold text-primary">{title}</h4>
        <span className="text-right text-gray-500 w-24">€</span>
      </div>
      {assets?.map(
        (opr, idx) =>
          opr.category === title && (
            <div
              key={`${title}-${idx}`}
              className="flex items-center justify-between px-3 py-1 border-t border-gray-100"
            >
              <span className="text-left text-primary truncate">
                {opr.name}
              </span>
              <span className="text-right text-gray-800 font-medium w-24">
                {isClient
                  ? currency.format(opr.amount * (opr.quantity ?? 1))
                  : "-"}
              </span>
            </div>
          )
      )}
    </div>
  );

  const liabilitiesRenderCategory = (title: liabilitiesAllowedCategories) => (
    <div key={title} className="flex flex-col text-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <h4 className="font-semibold text-primary">{title}</h4>
        <span className="text-right text-gray-500 w-24">€</span>
      </div>
      {liabilities?.map(
        (opr, idx) =>
          opr.category === title && (
            <div
              key={`${title}-${idx}`}
              className="flex items-center justify-between px-3 py-1 border-t border-gray-100"
            >
              <span className="text-left text-primary truncate">
                {opr.name}
              </span>
              <span className="text-right text-gray-800 font-medium w-24">
                {isClient ? currency.format(opr.amount) : "-"}
              </span>
            </div>
          )
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-5xl border rounded-lg shadow-sm overflow-hidden bg-white">
        {/* Header */}
        <div className="flex divide-x divide-gray-300">
          {/* Financial Situation */}
          <div className="w-1/2">
            <h2 className="text-center py-3 bg-[#2C5C4C] text-white font-semibold border-b border-white/60">
              Financial Situation
            </h2>

            <div className="flex border-t h-full border-gray-300">
              {/* Assets */}
              <div className="w-1/2 border-r h-full border-gray-300">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="font-medium text-primary">Assets</h3>
                  <span className="text-gray-500 w-24 text-center">€</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {assetsCategories.map((cat) => assetsRenderCategory(cat))}
                </div>
              </div>

              {/* Liabilities */}
              <div className="w-1/2">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="font-medium text-primary">Liabilities</h3>
                  <span className="text-gray-500 w-24 text-center">€</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {liabilityCategories.map((cat) =>
                    liabilitiesRenderCategory(cat)
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Economic Situation */}
          <div className="w-1/2">
            <h2 className="text-center py-3 bg-[#2C5C4C] text-white font-semibold border-b border-white/60">
              Economic Situation
            </h2>

            <div className="flex border-t h-full border-gray-300">
              {/* Revenue */}
              <div className="w-1/2 h-full border-r border-gray-300">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="text-center font-medium text-primary">
                    Revenue
                  </h3>
                </div>
                <div className="p-3 text-gray-600 text-sm italic">
                  (Revenue entries here)
                </div>
              </div>

              {/* Expenses */}
              <div className="w-1/2">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="text-center font-medium text-primary">
                    Expenses
                  </h3>
                </div>
                <div className="p-3 text-gray-600 text-sm italic">
                  (Expense entries here)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
