import { InvoiceStatus, InvoiceType, Party } from "@/lib/generated/prisma";

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

export interface Invoice {
  number: string;
  id: string;
  type: InvoiceType;
  issueDate: Date;
  dueDate: Date | null;
  description: string | null;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  businessId: string;
  customerId: string | null;
  vendorId: string | null;
  customer?: Party | null;
  vendor?: Party | null;
  payments?: Payment[] | null;
}
