import { z } from "zod";

export const inputSupplierSchema = z.object({
  legalName: z.string().min(1, { error: "Legal Name is required!" }),
  vatNumber: z.string().min(1, { error: "VAT number is required!" }),
  email: z.string().min(1, { error: "Email is required!" }),
  phone: z.string().optional(),
  country: z.string().min(1, { error: "Country is required!" }),
  address: z.string().min(1, { error: "Address is required!" }),
  notes: z.string().optional(),
});

export const fullSupplierSchema = inputSupplierSchema.extend({
  type: z.enum(["VEDNOR", "CUSTOMER"]),
});
