import { z } from "zod";

export const deleteCategorySchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteCategoryDto = z.infer<typeof deleteCategorySchema>;
