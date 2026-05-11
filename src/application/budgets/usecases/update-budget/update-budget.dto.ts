import { createBudgetSchema } from "../create-budget/create-budget.dto";

export const updateBudgetSchema = createBudgetSchema.extend({
  id: createBudgetSchema.shape.eventId,
});

export type UpdateBudgetDto = import("zod").infer<typeof updateBudgetSchema>;
