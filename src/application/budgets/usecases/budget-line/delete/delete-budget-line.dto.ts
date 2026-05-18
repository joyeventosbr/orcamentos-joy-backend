import { z } from "zod";

export const deleteBudgetLineSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteBudgetLineDto = z.infer<typeof deleteBudgetLineSchema>;
