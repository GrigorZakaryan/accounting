"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/currency";
import { inputSaleInvoiceSchema } from "@/schemas/invoice-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { ChartAccount, Party } from "@/lib/generated/prisma";
import { Spinner } from "@/components/ui/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DiscountProps {
  num: number;
  value: number;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discounts: DiscountProps[];
  tax: "22" | "10" | "5" | "4" | "0";
  chartAccountId: string;
  subtotal: number;
  total: number;
}

export const InvoiceForm = ({
  customers,
  CoAs,
}: {
  customers: Party[];
  CoAs: ChartAccount[];
}) => {
  const [loading, setLoading] = useState(false);
  const [issueDateOpen, issueDateSetOpen] = useState(false);
  const [dueDateOpen, dueDateSetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      discounts: [
        { num: 1, value: 0 },
        { num: 2, value: 0 },
        { num: 3, value: 0 },
        { num: 4, value: 0 },
      ],
      tax: "22",
      chartAccountId: "",
      subtotal: 0,
      total: 0,
    },
  ]);

  const form = useForm<z.infer<typeof inputSaleInvoiceSchema>>({
    resolver: zodResolver(inputSaleInvoiceSchema),
    defaultValues: {
      issueDate: new Date(),
      dueDate: new Date(),
      description: "",
      currency: "EUR",
      customerId: "",
    },
  });

  const calculateSubtotal = () => {
    return Number(
      invoiceItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2),
    );
  };

  const calculateTax = () => {
    return invoiceItems.reduce(
      (acc, item) => acc + (item.subtotal * Number(item.tax)) / 100,
      0,
    );
  };

  const calculateTotal = () => {
    return Number((calculateSubtotal() + calculateTax()).toFixed(2));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      discounts: [
        { num: 1, value: 0 },
        { num: 2, value: 0 },
        { num: 3, value: 0 },
        { num: 4, value: 0 },
      ],
      tax: "22",
      chartAccountId: "",
      subtotal: 0,
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
    discountNum,
  }: {
    id: string;
    field: keyof InvoiceItem;
    value: string | number;
    discountNum?: number;
  }) => {
    setInvoiceItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        let updated: InvoiceItem = { ...item };

        // Handle discount update correctly
        if (field === "discounts") {
          updated.discounts = updated.discounts.map((d) =>
            d.num === discountNum ? { ...d, value: Number(value) } : d,
          );
        } else {
          updated = { ...updated, [field]: value };
        }

        // Recalculate amounts
        const baseAmount = Number(updated.quantity) * Number(updated.unitPrice);

        let discountedAmount = baseAmount;

        for (let i = 0; i < updated.discounts.length; i++) {
          const percent = updated.discounts[i].value;
          discountedAmount =
            discountedAmount - (discountedAmount * percent) / 100;
        }

        updated.subtotal = Number(discountedAmount.toFixed(2));
        updated.total = Number(
          (
            discountedAmount +
            (discountedAmount * Number(updated.tax)) / 100
          ).toFixed(2),
        );

        return updated;
      }),
    );
  };

  const onSubmit = async (
    invoiceData: z.infer<typeof inputSaleInvoiceSchema>,
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
      toast.success("Invoice created successfully!");
      router.push("/sales");
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
              <div className="grid grid-cols-2 gap-10">
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
                              {mounted && field.value
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
                              {mounted && field.value
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* INVOICE ITEMS */}

      <Card>
        <CardHeader className="flex items-center justify-between w-full">
          <CardTitle>Line Items</CardTitle>
          <Button disabled={loading} onClick={() => addItem()}>
            <Plus /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col items-end gap-10">
          <div className="w-full flex flex-col gap-5">
            {invoiceItems.map((item, idx) => {
              return (
                <div key={item.id} className="w-full flex items-center">
                  <div className="p-5 bg-muted rounded-lg border w-full">
                    <div className="flex flex-col items-start justify-between w-full gap-5">
                      <div className="flex flex-col items-start gap-2 w-full">
                        <label
                          className="text-sm font-medium"
                          htmlFor={`${idx}-item-description`}
                        >
                          Description
                        </label>
                        <Textarea
                          disabled={loading}
                          onChange={(e) =>
                            updateItem({
                              id: item.id,
                              field: "description",
                              value: e.target.value,
                            })
                          }
                          value={item.description}
                          className="bg-white"
                          id={`${idx}-item-description`}
                          placeholder="Item description"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start gap-2 min-w-30">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-quantity`}
                          >
                            Quantity
                          </label>
                          <Input
                            disabled={loading}
                            min={1}
                            onChange={(e) =>
                              updateItem({
                                id: item.id,
                                field: "quantity",
                                value: Number(e.target.value),
                              })
                            }
                            value={item.quantity}
                            type="number"
                            className="bg-white"
                            id={`${idx}-item-quantity`}
                            placeholder="1"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-2 min-w-30">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-unitprice`}
                          >
                            Unit Price
                          </label>
                          <Input
                            step={"0.01"}
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
                            id={`${idx}-item-unitprice`}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-2 min-w-30">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-discount`}
                          >
                            Discount %
                          </label>
                          <div className="flex items-center gap-1">
                            {item.discounts.map((discount, discountIdx) => (
                              <Input
                                key={discountIdx}
                                disabled={loading}
                                onChange={(e) =>
                                  updateItem({
                                    id: item.id,
                                    field: `discounts`,
                                    value: Number(e.target.value),
                                    discountNum: discountIdx + 1,
                                  })
                                }
                                max={100}
                                min={0}
                                value={discount.value}
                                type="number"
                                className="bg-white"
                                id={`${idx}-item-discount`}
                                placeholder="5"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 min-w-30">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-subtotal`}
                          >
                            Subtotal
                          </label>
                          <Input
                            step={"0.01"}
                            disabled={loading}
                            onChange={() => {}}
                            value={item.subtotal.toFixed(2)}
                            type="number"
                            className="bg-white cursor-not-allowed"
                            id={`${idx}-item-total`}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex flex-col items-start gap-2 min-w-30">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-total`}
                          >
                            Total{" "}
                            <span className="text-muted-foreground">
                              {"(TAX included)"}
                            </span>
                          </label>
                          <Input
                            step={"0.01"}
                            disabled={loading}
                            onChange={() => {}}
                            value={item.total.toFixed(2)}
                            type="number"
                            className="bg-white cursor-not-allowed"
                            id={`${idx}-item-total`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start gap-2">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-discount`}
                          >
                            Tax %
                          </label>
                          <Select
                            value={item.tax}
                            onValueChange={(e) =>
                              updateItem({
                                id: item.id,
                                field: "tax",
                                value: e,
                              })
                            }
                          >
                            <SelectTrigger
                              disabled={loading}
                              className="min-w-[200px] bg-white cursor-pointer"
                            >
                              <SelectValue placeholder="Tax" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="22">
                                  22% Standard rate
                                </SelectItem>
                                <SelectItem value="10">10% Reduced</SelectItem>
                                <SelectItem value="5">5% Reduced</SelectItem>
                                <SelectItem value="4">
                                  4% Super-reduced
                                </SelectItem>
                                <SelectItem value="0">0% Excempt</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <label
                            className="text-sm font-medium"
                            htmlFor={`${idx}-item-discount`}
                          >
                            Account
                          </label>
                          <Popover>
                            <PopoverTrigger disabled={loading} asChild>
                              <Button
                                disabled={loading}
                                variant="outline"
                                role="combobox"
                                className="w-[300px] justify-between"
                              >
                                {item.chartAccountId ? (
                                  <>
                                    {
                                      CoAs.find(
                                        (CoA) => CoA.id === item.chartAccountId,
                                      )?.code
                                    }{" "}
                                    |{" "}
                                    {
                                      CoAs.find(
                                        (CoA) => CoA.id === item.chartAccountId,
                                      )?.name
                                    }
                                  </>
                                ) : (
                                  "Select account..."
                                )}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput />
                                <CommandList className="min-w-[400px]">
                                  <CommandEmpty>No account found.</CommandEmpty>
                                  <CommandGroup>
                                    {CoAs.map((CoA) => (
                                      <CommandItem
                                        key={CoA.id}
                                        value={CoA.name.toLocaleLowerCase()}
                                        onSelect={() => {
                                          updateItem({
                                            id: item.id,
                                            field: "chartAccountId",
                                            value: CoA.id,
                                          });
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            item.chartAccountId === CoA.id
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {CoA.code} | {CoA.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start ml-5">
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
      <div className="w-full flex items-center justify-end gap-2">
        <Button
          disabled={loading}
          onClick={() => redirect("/sales")}
          size={"lg"}
          variant={"outline"}
        >
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
              Save
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
