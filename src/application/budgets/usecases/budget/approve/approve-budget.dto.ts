import { z } from "zod";

export const approveBudgetSchema = z.object({
  id: z.string().trim().min(1),
  updatedBy: z.string().trim().min(1),
});

export type ApproveBudgetDto = z.infer<typeof approveBudgetSchema>;
