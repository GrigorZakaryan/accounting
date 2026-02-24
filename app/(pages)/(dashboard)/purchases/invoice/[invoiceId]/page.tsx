import { db } from "@/lib/db";
import { InvoicePDFContent } from "./components/content";

export default async function InvoicePDFPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const business = await db.business.findFirst({});

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true, vendor: true },
  });

  if (!invoice || !business) {
    return "Something went wrong!";
  }

  return (
    <div className="w-full h-full inset-0 absolute">
      <InvoicePDFContent invoice={invoice} business={business} />;
    </div>
  );
}
