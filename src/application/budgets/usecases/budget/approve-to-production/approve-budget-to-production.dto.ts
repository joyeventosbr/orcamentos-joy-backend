import { z } from "zod";

export const approveBudgetToProductionSchema = z.object({
  id: z.string().trim().min(1),
  updatedBy: z.string().trim().min(1),
});

export type ApproveBudgetToProductionDto = z.infer<
  typeof approveBudgetToProductionSchema
>;
