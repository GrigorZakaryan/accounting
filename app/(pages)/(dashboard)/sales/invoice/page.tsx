import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { InvoiceForm } from "./components/invoice-form";
import { db } from "@/lib/db";

export default async function SaleInvoicePage() {
  const customers = await db.party.findMany({ where: { type: "CUSTOMER" } });
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
              Create Invoice
            </li>
          </ul>
        </div>
      </header>
      <div className="p-5 pt-20">
        <div className="flex flex-col items-start space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold text-primary">
              Create Invoice
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to generate a new invoice.
          </p>
        </div>
      </div>
      <div className="px-5 pb-10">
        <InvoiceForm customers={customers} />
      </div>
    </div>
  );
}
