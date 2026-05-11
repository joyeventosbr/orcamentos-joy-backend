import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().trim().min(1),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
