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
import { formatCurrency } from "@/utils/currency";
import { Party } from "@/lib/generated/prisma";
import { Invoice, Payment } from "@/types/purchases";
import { format } from "date-fns";
import {
  Download,
  MoreHorizontal,
  Plus,
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
import {
  AlertDialog,
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export const SalesContent = ({
  invoices,
  customers,
  payments,
}: {
  invoices: Invoice[];
  customers: Party[];
  payments: Payment[];
}) => {
  const [tab, setTab] = useState<"invoices" | "customers" | "payments">(
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
            onClick={() => setTab("customers")}
            className={`px-2 pb-2 ${
              tab === "customers" && "border-b border-primary text-primary"
            } cursor-pointer `}
          >
            Customers
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
              <Link href={"/sales/invoice"}>
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
                  <TableHead>Customer</TableHead>
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
                    <TableCell>{invoice.customer?.legalName}</TableCell>
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
                      {isClient ? formatCurrency(Number(invoice.total)) : "-"}
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
                                    `/pdf/sales/${invoice.id}`,
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
      {tab === "customers" && (
        <>
          <div className="flex items-center justify-between mt-5">
            <div>
              <h2 className="font-medium">Customers</h2>
              <p className="text-sm text-muted-foreground">
                List of all of your customers.
              </p>
            </div>
            <div>
              <Link href={"/sales/customer"}>
                <Button>
                  <Plus /> Create Customer
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg mt-5">
            <Table>
              <TableCaption>A list of your recent customers.</TableCaption>
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
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.legalName}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {customer.phone ? customer.phone : "-"}
                    </TableCell>
                    <TableCell>
                      {customer.country ? customer.country : "-"}
                    </TableCell>
                    <TableCell>
                      {customer.address ? customer.address : "-"}
                    </TableCell>
                    <TableCell>{customer.vatNumber}</TableCell>
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
              <Link href={"/sales/payment"}>
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
