import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { convertIntToDecimal, formatCurrency } from "@/utils/currency";
import { format } from "date-fns";

export default async function InvoicePDFPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  if (!invoiceId) {
    return null;
  }

  const business = await db.business.findFirst({});

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
    include: { vendor: true, items: true },
  });

  const subtotal = invoice?.items.reduce(
    (acc, item) =>
      acc +
      item.unitPrice * item.quantity -
      item.unitPrice * item.quantity * (item.discount / 100),
    0,
  );

  const taxedAmount = invoice?.items.reduce(
    (acc, item) => acc + item.subtotal * (item.tax / 100),
    0,
  );

  const total = invoice?.items.reduce((acc, item) => acc + item.total, 0);

  return (
    <html>
      <body>
        <div className="w-full h-full p-10">
          <h1 className="text-4xl font-bold">INVOICE-{invoice?.number}</h1>
          <div className="pt-10">
            <h2 className="font-bold">
              Issue Date:{" "}
              <span className="font-normal">
                {invoice?.issueDate &&
                  format(invoice?.issueDate, "dd MMM yyyy")}
              </span>
            </h2>
            <h2 className="font-bold">
              Due Date:{" "}
              <span className="font-normal">
                {invoice?.dueDate && format(invoice?.dueDate, "dd MMM yyyy")}
              </span>
            </h2>
          </div>
          <div className="flex items-start justify-between w-full pt-16">
            <div className="text-left">
              <h2 className="font-bold">Supplier</h2>
              <div>
                <h3 className="font-medium">{invoice?.vendor?.legalName}</h3>
                <h3 className="text-sm">
                  {invoice?.vendor?.address}, {invoice?.vendor?.country}
                </h3>
                <h3 className="text-sm">
                  {invoice?.vendor?.vatNumber
                    ? invoice?.vendor?.vatNumber
                    : invoice?.vendor?.fiscalId}
                </h3>
              </div>
            </div>
            <div className="text-right">
              <h2 className="font-bold">Customer</h2>
              <div>
                <h3 className="font-medium">{business?.legalName}</h3>
                <h3 className="text-sm">
                  {business?.address}, {business?.country}
                </h3>
                <h3 className="text-sm">{business?.vatNumber}</h3>
              </div>
            </div>
          </div>
          <div className="pt-24">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] text-sm">
                    Description
                  </TableHead>
                  <TableHead className="text-center text-sm">
                    Quantity
                  </TableHead>
                  <TableHead className="text-sm">Unit Price</TableHead>
                  <TableHead className="text-center text-sm">
                    Discount %
                  </TableHead>
                  <TableHead className="text-center text-sm">Tax %</TableHead>
                  <TableHead className="text-right text-sm">
                    Amount{" "}
                    <span className="text-muted-foreground font-normal">
                      {"(Tax excluded)"}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-[150px] text-sm">
                      {item.description}
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatCurrency(convertIntToDecimal(item.unitPrice))}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.discount}%
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.tax}%
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(
                        convertIntToDecimal(
                          item.unitPrice * item.quantity -
                            item.unitPrice *
                              item.quantity *
                              (item.discount / 100),
                        ),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end w-full pt-24">
            <div className="w-full max-w-[250px]">
              <div className="flex items-center justify-between py-1">
                <h2>Subtotal</h2>
                <span>
                  {subtotal && formatCurrency(convertIntToDecimal(subtotal))}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <h2>Tax</h2>
                <span>
                  {taxedAmount &&
                    formatCurrency(convertIntToDecimal(taxedAmount))}
                </span>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between py-2">
                <h1 className="text-xl font-bold">Total</h1>
                <span className="text-xl font-bold">
                  {total && formatCurrency(convertIntToDecimal(total))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
