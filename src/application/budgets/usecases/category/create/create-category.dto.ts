import { z } from "zod";

export const createCategorySchema = z.object({
  budgetId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
