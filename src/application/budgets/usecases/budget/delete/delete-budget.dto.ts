import { z } from "zod";

export const deleteBudgetSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteBudgetDto = z.infer<typeof deleteBudgetSchema>;
