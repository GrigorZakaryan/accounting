"use client";
import { Business } from "@/lib/generated/prisma";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDFTemplate } from "./invoice-pdf";
import { Invoice } from "@/types/purchases";

export const InvoicePDFContent = ({
  invoice,
  business,
}: {
  invoice: Invoice;
  business: Business;
}) => {
  const subtotal = invoice.items.reduce((acc, item) => {
    let itemSubtotal = item.unitPrice * item.quantity;

    // apply cascading discounts on THIS item only
    item.discounts.forEach((d) => {
      if (d.value > 0) {
        itemSubtotal -= itemSubtotal * (d.value / 100);
      }
    });

    return acc + itemSubtotal;
  }, 0);

  const taxedAmount = invoice.items.reduce((acc, item) => {
    return acc + item.subtotal * (item.tax / 100);
  }, 0);

  const total = invoice.items.reduce((acc, item) => acc + item.total, 0);

  return (
    <PDFViewer className="w-full h-full">
      <InvoicePDFTemplate
        invoice={invoice}
        business={business}
        subtotal={subtotal ?? 0}
        total={total ?? 0}
        taxedAmount={taxedAmount ?? 0}
      />
    </PDFViewer>
  );
};
