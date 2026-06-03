import { z } from "zod";
import { bulkCreateBudgetLineSchema } from "./bulk-create-budget-line.dto";
import { bulkUpdateBudgetLineSchema } from "./bulk-update-budget-line.dto";

export const bulkUpdateBudgetLinesSchema = z.object({
  id: z.string().trim().min(1),
  updatedBy: z.string().trim().min(1),
  create: z.array(bulkCreateBudgetLineSchema).optional(),
  update: z.array(bulkUpdateBudgetLineSchema).optional(),
  delete: z.array(z.string().trim().min(1)).optional(),
});

export type BulkUpdateBudgetLinesDto = z.infer<
  typeof bulkUpdateBudgetLinesSchema
>;
