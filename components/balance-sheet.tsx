"use client";

import {
  assetsCategories,
  liabilityCategories,
  SingleOperationProps,
} from "@/operations";
import React from "react";

export const BalanceSheet = ({
  allOperations,
}: {
  allOperations: SingleOperationProps[];
}) => {
  const currency = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  });

  const renderCategory = (title: string) => (
    <div key={title} className="flex flex-col text-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <span className="text-right text-gray-500 w-24">€</span>
      </div>

      {allOperations.map(
        (opr, idx) =>
          opr.category === title && (
            <div
              key={`${title}-${idx}`}
              className="flex items-center justify-between px-3 py-1 border-t border-gray-100"
            >
              <span className="text-left text-gray-700 truncate">
                {opr.description === "" && opr.name}
              </span>
              <span className="text-right text-gray-800 font-medium w-24">
                {currency.format(opr.amount * opr.quantity)}
              </span>
            </div>
          )
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center my-10">
      <h1 className="font-bold text-2xl tracking-wide mb-6">Balance Sheet</h1>

      <div className="w-full max-w-5xl border rounded-lg shadow-sm overflow-hidden bg-white">
        {/* Header */}
        <div className="flex divide-x divide-gray-300">
          {/* Financial Situation */}
          <div className="w-1/2">
            <h2 className="text-center py-3 bg-gray-100 font-semibold text-gray-800 border-b border-gray-300">
              Financial Situation
            </h2>

            <div className="flex border-t border-gray-300">
              {/* Assets */}
              <div className="w-1/2 border-r border-gray-300">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="font-medium text-gray-700">Assets</h3>
                  <span className="text-gray-500 w-24 text-center">€</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {assetsCategories.map((cat) => renderCategory(cat))}
                </div>
              </div>

              {/* Liabilities */}
              <div className="w-1/2">
                <div className="flex items-center justify-between bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="font-medium text-gray-700">Liabilities</h3>
                  <span className="text-gray-500 w-24 text-center">€</span>
                </div>

                <div className="divide-y divide-gray-200">
                  {liabilityCategories.map((cat) => renderCategory(cat))}
                </div>
              </div>
            </div>
          </div>
          {/* Economic Situation */}
          <div className="w-1/2">
            <h2 className="text-center py-3 bg-gray-100 font-semibold text-gray-800 border-b border-gray-300">
              Economic Situation
            </h2>

            <div className="flex border-t border-gray-300">
              {/* Revenue */}
              <div className="w-1/2 border-r border-gray-300">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-300">
                  <h3 className="text-center font-medium text-gray-700">
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
                  <h3 className="text-center font-medium text-gray-700">
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
