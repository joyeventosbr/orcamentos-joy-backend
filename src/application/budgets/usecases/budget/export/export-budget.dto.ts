import { z } from "zod";

export const exportBudgetSchema = z.object({
  id: z.string().trim().min(1),
});

export type ExportBudgetDto = z.infer<typeof exportBudgetSchema>;
