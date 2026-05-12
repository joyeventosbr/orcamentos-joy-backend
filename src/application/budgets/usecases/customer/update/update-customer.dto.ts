import { z } from "zod";

export const updateCustomerSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).optional(),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
