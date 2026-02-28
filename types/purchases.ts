import {
  InvoiceItemDiscount,
  InvoiceStatus,
  InvoiceType,
  Party,
} from "@/lib/generated/prisma";

export interface Payment {
  amount: number;
  id: string;
  date: Date;
  method: string | null;
  note: string | null;
  invoiceId: string;
  invoice?: Invoice;
  // Remove notes and invoice if they're not needed
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  chartAccountId: string;
  subtotal: number;
  total: number;
  invoiceId: string;

  discounts: InvoiceItemDiscount[];
}

export interface Invoice {
  number: number;
  id: string;
  type: InvoiceType;
  issueDate: Date;
  dueDate: Date | null;
  description: string | null;
  subtotal: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  businessId: string;
  customerId: string | null;
  vendorId: string | null;
  customer?: Party | null;
  vendor?: Party | null;
  payments?: Payment[] | null;

  items: InvoiceItem[];
}
