import { z } from "zod";

export const updateCategorySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).optional(),
  code: z.string().trim().min(1).optional(),
  order: z.number().int().nonnegative().optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
