"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/currency";
import { inputSaleInvoiceSchema } from "@/schemas/invoice-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, Plus, Save, Trash } from "lucide-react";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import axios from "axios";
import { redirect } from "next/navigation";
import { Party } from "@/lib/generated/prisma";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const InvoiceForm = ({ customers }: { customers: Party[] }) => {
  const [loading, setLoading] = useState(false);
  const [issueDateOpen, issueDateSetOpen] = useState(false);
  const [dueDateOpen, dueDateSetOpen] = useState(false);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: useId(), description: "", quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const form = useForm<z.infer<typeof inputSaleInvoiceSchema>>({
    resolver: zodResolver(inputSaleInvoiceSchema),
    defaultValues: {
      number: "INV-",
      issueDate: new Date(),
      dueDate: new Date(),
      description: "",
      tax: 22,
      currency: "EUR",
      customerId: "",
    },
  });

  const [tax, setTax] = useState(22);

  const calculateSubtotal = () => {
    return invoiceItems.reduce((acc, item) => acc + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (tax / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: new Date().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };

    setInvoiceItems([...invoiceItems, newItem]);
  };

  const removeItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
    }
  };

  const updateItem = ({
    id,
    field,
    value,
  }: {
    id: string;
    field: keyof InvoiceItem;
    value: string | number;
  }) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total =
              Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const onSubmit = async (
    invoiceData: z.infer<typeof inputSaleInvoiceSchema>
  ) => {
    try {
      setLoading(true);
      await axios.post("/sales/api", {
        invoice: {
          ...invoiceData,
          businessId: "123",
          subtotal: calculateSubtotal(),
          total: calculateTotal(),
        },
        items: invoiceItems,
        payments: [],
      });
    } finally {
      setLoading(false);
    }

    redirect("/sales");
  };

  return (
    <div className="flex flex-col gap-10 w-full overflow-y-hidden">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form id="invoice-form" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center gap-10 w-full">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="INV-001"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the invoice number.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger disabled={loading} className="w-full">
                            <SelectValue placeholder="Choose customer" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {(customers.length === 0 || !customers) && (
                              <Link
                                className="cursor-pointer"
                                href={"/sales/customer"}
                              >
                                <Button
                                  variant={"outline"}
                                  className="w-full cursor-pointer"
                                >
                                  <Plus /> Create Customer
                                </Button>
                              </Link>
                            )}
                            {customers.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                className="flex items-center justify-center cursor-pointer"
                                value={customer.id}
                              >
                                {customer.legalName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Choose one of your customers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center mt-5 w-full gap-10">
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Popover
                          open={issueDateOpen}
                          onOpenChange={issueDateSetOpen}
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
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                date && form.setValue("issueDate", date);
                                issueDateSetOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Due Date</FormLabel>
                      <FormControl className="w-full">
                        <Popover
                          open={dueDateOpen}
                          onOpenChange={dueDateSetOpen}
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
                              className="w-full"
                              mode="single"
                              selected={field.value}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                date && form.setValue("dueDate", date);
                                dueDateSetOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-start gap-10 w-full mt-10">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Select
                          disabled={loading}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger disabled={loading} className="w-full">
                            <SelectValue placeholder="Choose vendor" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem
                              className="flex items-center justify-center cursor-pointer"
                              value="EUR"
                            >
                              EUR
                            </SelectItem>
                            <SelectItem
                              className="flex items-center justify-center cursor-pointer"
                              value="USD"
                            >
                              USD
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Choose one of your customers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Invoice Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Start typing here..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is the invoice description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center justify-between w-full">
          <CardTitle>Line Items</CardTitle>
          <Button disabled={loading} onClick={() => addItem()}>
            <Plus /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-end gap-10">
          <div className="w-full flex flex-col gap-5">
            {invoiceItems.map((item) => {
              return (
                <div key={item.id} className="p-5 bg-muted rounded-lg border">
                  <div className="flex items-end justify-between w-full gap-3">
                    <div className="flex flex-col items-start gap-2 w-full">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${item.id}-item-description`}
                      >
                        Description
                      </label>
                      <Input
                        disabled={loading}
                        onChange={(e) =>
                          updateItem({
                            id: item.id,
                            field: "description",
                            value: e.target.value,
                          })
                        }
                        value={item.description}
                        type="text"
                        className="bg-white"
                        id={`${item.id}-item-description`}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 min-w-30">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${item.id}-item-quantity`}
                      >
                        Quantity
                      </label>
                      <Input
                        disabled={loading}
                        onChange={(e) =>
                          updateItem({
                            id: item.id,
                            field: "quantity",
                            value: Number(e.target.value),
                          })
                        }
                        min={1}
                        value={item.quantity}
                        type="number"
                        className="bg-white"
                        id={`${item.id}-item-quantity`}
                        placeholder="1"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 min-w-30">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${item.id}-item-unitprice`}
                      >
                        Unit Price
                      </label>
                      <Input
                        disabled={loading}
                        onChange={(e) =>
                          updateItem({
                            id: item.id,
                            field: "unitPrice",
                            value: Number(e.target.value),
                          })
                        }
                        min={1}
                        value={item.unitPrice}
                        type="number"
                        className="bg-white"
                        id={`${item.id}-item-unitprice`}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 min-w-30">
                      <label
                        className="text-sm font-medium"
                        htmlFor={`${item.id}-item-total`}
                      >
                        Total
                      </label>
                      <Input
                        disabled={loading}
                        onChange={() => {}}
                        value={item.total}
                        type="number"
                        className="bg-white"
                        id={`${item.id}-item-total`}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-2 ml-5">
                      <Button
                        disabled={loading ? true : invoiceItems.length <= 1}
                        onClick={() => removeItem(item.id)}
                        size={"icon"}
                        variant={"destructive"}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="max-w-100 w-full flex flex-col items-start gap-3">
            <div className="flex items-center justify-between w-full">
              <h3 className="font-medium text-sm">Subtotal</h3>
              <span className="font-medium">
                {formatCurrency(calculateSubtotal())}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-medium text-sm">Tax Rate</h3>
              <Input
                disabled={loading}
                className="max-w-20"
                min={0}
                max={99}
                type="number"
                value={tax}
                onChange={(e) => {
                  if (
                    Number(e.target.value) < 100 &&
                    Number(e.target.value) >= 0
                  ) {
                    setTax(Number(e.target.value));
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <h3 className="font-medium text-sm">Tax</h3>
              <span className="font-medium">
                {formatCurrency(calculateTax())}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between w-full">
              <h3 className="font-medium text-xl">Total</h3>
              <span className="font-medium text-xl">
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-end w-full gap-3">
        <Button disabled={loading} size={"lg"} variant={"outline"}>
          Cancel
        </Button>
        <Button
          disabled={loading}
          size={"lg"}
          onClick={form.handleSubmit(onSubmit)}
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Save />
              Submit
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
