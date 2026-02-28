"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertIntToDecimal, formatCurrency } from "@/utils/currency";
import { Party } from "@/lib/generated/prisma";
import { Invoice, Payment } from "@/types/purchases";
import { format } from "date-fns";
import {
  Download,
  MoreHorizontal,
  Plus,
  Printer,
  Receipt,
  ReceiptText,
  Trash,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

export const PurchasesContent = ({
  invoices,
  suppliers,
  payments,
}: {
  invoices: Invoice[];
  suppliers: Party[];
  payments: Payment[];
}) => {
  const [tab, setTab] = useState<"invoices" | "suppliers" | "payments">(
    "invoices",
  );
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const router = useRouter();

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/purchases/api/${id}`);
      toast.success("Invoice Deleted Succesfully!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full border-b mt-10">
        <div className="flex items-center gap-5">
          <span
            onClick={() => setTab("invoices")}
            className={`px-2 pb-2 ${
              tab === "invoices" && "border-b border-primary text-primary"
            } cursor-pointer `}
          >
            Invoices
          </span>
          <span
            onClick={() => setTab("suppliers")}
            className={`px-2 pb-2 ${
              tab === "suppliers" && "border-b border-primary text-primary"
            } cursor-pointer `}
          >
            Suppliers
          </span>
          <span
            onClick={() => setTab("payments")}
            className={`px-2 pb-2 ${
              tab === "payments" && "border-b border-primary text-primary"
            } cursor-pointer `}
          >
            Payments
          </span>
        </div>
      </div>
      {tab === "invoices" && (
        <>
          <div className="flex items-center justify-between mt-5">
            <div>
              <h2 className="font-medium">Invoice</h2>
              <p className="text-sm text-muted-foreground">
                List of all of your invoices.
              </p>
            </div>
            <div>
              <Link href={"/purchases/invoice"}>
                <Button>
                  <Plus /> Create Invoice
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg mt-5">
            <Table>
              <TableCaption>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Amount</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      INV-{invoice.number}
                    </TableCell>
                    <TableCell>{invoice.vendor?.legalName}</TableCell>
                    <TableCell>
                      {format(invoice.issueDate, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate
                        ? format(invoice.dueDate, "dd MMM yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`
                        ${
                          invoice.status === "PENDING" &&
                          "bg-yellow-100 text-yellow-700"
                        }
                      ${
                        invoice.status === "PAID" &&
                        "bg-green-100 text-green-700"
                      }
                      ${
                        invoice.status === "OVERDUE" &&
                        "bg-red-100 text-red-700"
                      }
                      `}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {isClient ? formatCurrency(invoice.total) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.open(
                                    `/pdf/purchases/${invoice.id}`,
                                    "_blank",
                                    "noopener,noreferrer",
                                  )
                                }
                              >
                                <Download />
                                Download PDF
                              </DropdownMenuItem>

                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent size="sm">
                          <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                              <Trash2Icon />
                            </AlertDialogMedia>
                            <AlertDialogTitle>
                              Delete INV-{invoice.number}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this invoice and all
                              realted information. Journal Entries, Payments and
                              other related info will be deleted as well.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={loading}
                              variant="outline"
                              className="cursor-pointer"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <Button
                              disabled={loading}
                              onClick={() => onDelete(invoice.id)}
                              variant="destructive"
                              className="cursor-pointer"
                            >
                              {loading ? <Spinner /> : "Delete"}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      {tab === "suppliers" && (
        <>
          <div className="flex items-center justify-between mt-5">
            <div>
              <h2 className="font-medium">Suppliers</h2>
              <p className="text-sm text-muted-foreground">
                List of all of your suppliers.
              </p>
            </div>
            <div>
              <Link href={"/purchases/supplier"}>
                <Button>
                  <Plus /> Create Supplier
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg mt-5">
            <Table>
              <TableCaption>A list of your recent suppliers.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Legal Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>VAT/TAX ID</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      {supplier.legalName}
                    </TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>
                      {supplier.phone ? supplier.phone : "-"}
                    </TableCell>
                    <TableCell>
                      {supplier.country ? supplier.country : "-"}
                    </TableCell>
                    <TableCell>
                      {supplier.address ? supplier.address : "-"}
                    </TableCell>
                    <TableCell>{supplier.vatNumber}</TableCell>
                    <TableCell className="text-right">
                      <MoreHorizontal className="w-4 h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
      {tab === "payments" && (
        <>
          <div className="flex items-center justify-between mt-5">
            <div>
              <h2 className="font-medium">Payments</h2>
              <p className="text-sm text-muted-foreground">
                List of all of your payments.
              </p>
            </div>
            <div>
              <Link href={"/purchases/payment"}>
                <Button>
                  <Plus /> Create Payment
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg mt-5">
            <Table>
              <TableCaption>A list of your recent payments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-left">Descritpion</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {format(payment.date, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      {
                        invoices.find(
                          (invoice) => invoice.id === payment.invoiceId,
                        )?.number
                      }
                    </TableCell>
                    <TableCell className="text-left">
                      {payment.note ? payment.note : "-"}
                    </TableCell>
                    <TableCell className="text-left">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <MoreHorizontal className="w-4 h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </>
  );
};
