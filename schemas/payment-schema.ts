import { z } from "zod";

export const paymentSchema = z.object({
  date: z.date().min(1, { error: "Date is required!" }),
  amount: z.number().min(0.01, { error: "Amount is required!" }),
  notes: z.string().optional(),
  invoiceId: z.string().min(1),
});
