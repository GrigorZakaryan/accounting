import { z } from "zod";

export const inputJournalEntrySchema = z.object({
  date: z.date().min(1, { error: "Date is required!" }),
  description: z.string().optional(),
});
