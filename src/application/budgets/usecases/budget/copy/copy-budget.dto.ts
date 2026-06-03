import { z } from "zod";

export const copyBudgetSchema = z.object({
  id: z.string().trim().min(1),
  createdBy: z.string().trim().min(1),
});

export type CopyBudgetDto = z.infer<typeof copyBudgetSchema>;
