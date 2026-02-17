"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { paymentSchema } from "@/schemas/payment-schema";
import { Invoice } from "@/types/purchases";
import { formatCurrency } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  CreditCard,
  DollarSign,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  Receipt,
  Save,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const PaymentForm = ({ invoices }: { invoices: Invoice[] }) => {
  const [loading, setLoading] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>();
  const router = useRouter();
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      date: new Date(),
      amount: 0,
      notes: "",
      invoiceId: "",
    },
  });

  useEffect(() => {
    const invoiceId = form.watch("invoiceId");
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    setSelectedInvoice(invoice);
  }, [form.watch("invoiceId"), invoices]);

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      setLoading(true);
      await axios.post("/purchases/payment/api", values);
      toast.success("Payment recored successfully!");
      router.push("/purchases");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-center gap-5">
            <FormField
              control={form.control}
              name="invoiceId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Select Invoice</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        disabled={loading}
                        className="min-w-[300px] bg-white"
                      >
                        <SelectValue placeholder="Select Invoice" />
                      </SelectTrigger>
                      <SelectContent align="start">
                        {invoices.map((invoice) => (
                          <SelectItem
                            disabled={loading}
                            key={invoice.id}
                            value={invoice.id}
                          >
                            <div className="flex gap-3">
                              <span className="font-medium">
                                {invoice.number}
                              </span>{" "}
                              -{" "}
                              <span className="font-medium">
                                {invoice.vendor?.legalName}
                              </span>{" "}
                              -{" "}
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
                              </Badge>{" "}
                              -{" "}
                              <span className="font-medium">
                                {formatCurrency(invoice.total)}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            {selectedInvoice && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="w-full flex flex-row-reverse items-start gap-4">
                  <Card className="w-full">
                    <CardHeader>
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="text-primary w-5 h-5" />
                          <CardTitle className="text-xl">
                            Record Payment
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Fill up the form to add a payment record
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center w-full gap-3">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  step={"0.01"}
                                  disabled={loading}
                                  className="w-full"
                                  type="number"
                                  value={form.watch("amount")}
                                  onChange={(e) =>
                                    form.setValue(
                                      "amount",
                                      Number(e.target.value),
                                    )
                                  }
                                  placeholder="0,00"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Popover
                                  open={dateOpen}
                                  onOpenChange={setDateOpen}
                                >
                                  <PopoverTrigger
                                    disabled={loading}
                                    className="w-full"
                                    asChild
                                  >
                                    <Button
                                      disabled={loading}
                                      variant="outline"
                                      id="date"
                                      className="w-full justify-between font-normal"
                                    >
                                      {field.value
                                        ? field.value.toLocaleDateString()
                                        : "Select date"}
                                      <ChevronDownIcon />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      disabled={{ after: new Date() }}
                                      mode="single"
                                      selected={field.value}
                                      captionLayout="dropdown"
                                      onSelect={(date) => {
                                        date && form.setValue("date", date);
                                        setDateOpen(false);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Additional Notes{" "}
                                <span className="text-sm text-muted-foreground font-medium">
                                  {"(optional)"}
                                </span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  disabled={loading}
                                  className="w-full"
                                  {...field}
                                  placeholder="Start typing here..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        disabled={loading}
                        type="submit"
                        className="w-full"
                      >
                        {loading ? (
                          <Spinner />
                        ) : (
                          <>
                            <Save />
                            Record Payment
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-full">
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <FileText className="text-primary w-5 h-5" />
                          <CardTitle className="text-xl">
                            Invoice Details
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Complete information for the selected invoice
                        </p>
                      </div>
                      <Badge
                        className={`
                    ${
                      selectedInvoice.status === "PENDING" &&
                      "bg-yellow-100 text-yellow-700"
                    }
                    ${
                      selectedInvoice.status === "PAID" &&
                      "bg-green-100 text-green-700"
                    }
                    ${
                      selectedInvoice.status === "OVERDUE" &&
                      "bg-red-100 text-red-700"
                    }
                `}
                      >
                        {selectedInvoice.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-16">
                        <div>
                          <span className="text-sm text-muted-foreground font-medium">
                            Invoice Number
                          </span>
                          <h3 className="font-semibold text-lg">
                            {selectedInvoice.number}
                          </h3>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground font-medium">
                            Issue Date
                          </span>
                          <h3 className="font-semibold text-lg">
                            {format(selectedInvoice.issueDate, "dd/MM/yyyy")}
                          </h3>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground font-medium">
                            Due Date
                          </span>
                          <h3 className="font-semibold text-lg">
                            {selectedInvoice.dueDate
                              ? format(selectedInvoice.dueDate, "dd/MM/yyyy")
                              : "-"}
                          </h3>
                        </div>
                      </div>
                      <Separator className="my-5" />
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-2">
                            <User className="text-primary w-5 h-5" />
                            <h3 className="text-xl font-medium">
                              Supplier Info
                            </h3>
                          </div>
                          <div className="mt-2">
                            <span className="text-lg font-medium">
                              {selectedInvoice.vendor?.legalName}
                            </span>
                            <div className="flex w-full items-center gap-2 mt-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {selectedInvoice.vendor?.email}
                              </span>
                            </div>
                            <div className="flex w-full items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {selectedInvoice.vendor?.phone ?? "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Separator className="my-5" />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start gap-1 w-full">
                          <div className="flex items-center gap-2">
                            <DollarSign className="text-primary w-5 h-5" />
                            <h3 className="text-xl font-medium">
                              Financial Summary
                            </h3>
                          </div>
                          <div className="flex flex-col items-start gap-3 mt-2 w-full">
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold">
                                Total Amount
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(selectedInvoice.total)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold">Total Paid</span>
                              <span className="font-semibold">
                                {formatCurrency(
                                  selectedInvoice.payments?.reduce(
                                    (acc, payment) =>
                                      acc + Number(payment.amount),
                                    0,
                                  ) ?? 0,
                                )}
                              </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between w-full">
                              <span className="font-semibold text-xl">
                                Balance to Pay
                              </span>
                              <span className="font-semibold text-xl">
                                {formatCurrency(
                                  selectedInvoice.total -
                                    (selectedInvoice.payments?.reduce(
                                      (acc, payment) =>
                                        acc + Number(payment.amount),
                                      0,
                                    ) ?? 0),
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <Receipt className="text-primary w-5 h-5" />
                        <CardTitle className="text-xl">
                          Payments History
                        </CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedInvoice.payments?.length === 0
                          ? "No payment record yet!"
                          : `${selectedInvoice.payments?.length} payment records`}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedInvoice.payments?.length === 0 ||
                    !selectedInvoice.payments ? (
                      <div className="flex items-center justify-center w-full min-h-[100px]">
                        <div className="flex flex-col items-center gap-3">
                          <Receipt className="text-muted-foreground w-16 h-16" />
                          <p className="text-muted-foreground font-medium">
                            No Payment Record
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Table>
                        <TableCaption>
                          A list of your recent payments.
                        </TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Invoice</TableHead>
                            <TableHead className="text-left">
                              Descritpion
                            </TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead className="text-right"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedInvoice.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell className="font-medium">
                                {format(payment.date, "dd/MM/yyyy")}
                              </TableCell>
                              <TableCell>
                                {
                                  invoices.find(
                                    (invoice) =>
                                      invoice.id === payment.invoiceId,
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
                    )}
                  </CardContent>
                  <CardFooter></CardFooter>
                </Card>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
