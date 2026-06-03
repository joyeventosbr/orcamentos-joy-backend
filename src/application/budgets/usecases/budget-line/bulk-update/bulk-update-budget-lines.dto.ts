import { z } from "zod";
import { createBudgetLineDataSchema } from "../create/create-budget-line.dto";
import { updateBudgetLineDataSchema } from "../update/update-budget-line.dto";

export const bulkUpdateBudgetLinesSchema = z.object({
  budgetId: z.string().trim().min(1),
  updatedBy: z.string().trim().min(1),
  create: z.array(createBudgetLineDataSchema).optional(),
  update: z.array(updateBudgetLineDataSchema).optional(),
  delete: z.array(z.string().trim().min(1)).optional(),
});

export type BulkUpdateBudgetLinesDto = z.infer<
  typeof bulkUpdateBudgetLinesSchema
>;
