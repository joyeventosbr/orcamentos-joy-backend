import { z } from "zod";

export const getBudgetSchema = z.object({
  id: z.string().trim().min(1),
});

export type GetBudgetDto = z.infer<typeof getBudgetSchema>;
