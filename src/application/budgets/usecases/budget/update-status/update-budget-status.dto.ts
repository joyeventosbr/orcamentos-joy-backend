import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { z } from "zod";

export const updateBudgetStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: z.nativeEnum(BudgetStatus),
  updatedBy: z.string().trim().min(1),
});

export type UpdateBudgetStatusDto = z.infer<typeof updateBudgetStatusSchema>;
