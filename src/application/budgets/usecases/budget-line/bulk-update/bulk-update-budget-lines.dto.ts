import { z } from "zod";
import { createBudgetLineSchema } from "../create/create-budget-line.dto";
import { updateBudgetLineSchema } from "../update/update-budget-line.dto";

export const bulkUpdateBudgetLinesSchema = z.object({
  create: z.array(createBudgetLineSchema).optional(),
  update: z.array(updateBudgetLineSchema).optional(),
  delete: z.array(z.string().trim().min(1)).optional(),
});

export type BulkUpdateBudgetLinesDto = z.infer<
  typeof bulkUpdateBudgetLinesSchema
>;
