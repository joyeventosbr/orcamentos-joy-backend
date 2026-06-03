import { z } from "zod";

export const createBudgetSchema = z.object({
  name: z.string().trim().min(1),
  customerId: z.string().trim().min(1),
  folderId: z.string().trim().min(1),
  createdBy: z.string().trim().min(1),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
