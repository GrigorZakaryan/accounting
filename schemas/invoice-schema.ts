import { z } from "zod";

export const inputPurchaseInvoiceSchema = z.object({
  issueDate: z.date().min(1, { error: "This field is required!" }),
  dueDate: z.date().optional(),
  description: z.string().optional(),
  currency: z.string().min(1, { error: "This field is required!" }),
  vendorId: z.string().min(1, { error: "This field is required!" }),
});

export const inputSaleInvoiceSchema = z.object({
  issueDate: z.date().min(1, { error: "This field is required!" }),
  dueDate: z.date().optional(),
  description: z.string().optional(),
  currency: z.string().min(1, { error: "This field is required!" }),
  customerId: z.string().min(1, { error: "This field is required!" }),
});

export const fullPurchaseInvoiceSchema = inputPurchaseInvoiceSchema.extend({
  businessId: z.string().min(1),
  subtotal: z.number().min(0.01),
  total: z.number().min(0.01),
});

export const fullSaleInvoiceSchema = inputSaleInvoiceSchema.extend({
  businessId: z.string().min(1),
  subtotal: z.number().min(0.01),
  total: z.number().min(0.01),
});
