import { z } from "zod";

export const createBudgetSchema = z.object({
  customerId: z.string().trim().min(1),
  folderId: z.string().trim().min(1),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
