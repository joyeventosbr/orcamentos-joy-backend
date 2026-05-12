import { createBudgetSchema } from "../create/create-budget.dto";

export const updateBudgetSchema = createBudgetSchema.partial().extend({
  id: createBudgetSchema.shape.folderId,
});

export type UpdateBudgetDto = import("zod").infer<typeof updateBudgetSchema>;
