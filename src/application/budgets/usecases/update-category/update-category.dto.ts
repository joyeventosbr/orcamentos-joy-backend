import { z } from "zod";

export const updateCategorySchema = z.object({
  id: z.string().trim().min(1),
  budgetId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
