"use client";
import { Business } from "@/lib/generated/prisma";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDFTemplate } from "../../../components/invoice-pdf";
import { Invoice } from "@/types/purchases";

export const InvoicePDFContent = ({
  invoice,
  business,
}: {
  invoice: Invoice;
  business: Business;
}) => {
  const subtotal =
    invoice.items &&
    invoice?.items.reduce(
      (acc, item) =>
        acc +
        item.unitPrice * item.quantity -
        item.unitPrice * item.quantity * (item.discount / 100),
      0,
    );

  const taxedAmount =
    invoice.items &&
    invoice?.items.reduce(
      (acc, item) => acc + item.subtotal * (item.tax / 100),
      0,
    );

  const total =
    invoice.items && invoice?.items.reduce((acc, item) => acc + item.total, 0);

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
