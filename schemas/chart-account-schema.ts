import { z } from "zod";

export const inputCoASchema = z.object({
  code: z.string().min(1, { error: "Code is required!" }),
  name: z.string().min(1, { error: "Name is requierd!" }),
  type: z.enum(["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"]),
});
