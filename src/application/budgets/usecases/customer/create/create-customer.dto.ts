import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
