import { z } from "zod";

export const deleteCustomerSchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteCustomerDto = z.infer<typeof deleteCustomerSchema>;
