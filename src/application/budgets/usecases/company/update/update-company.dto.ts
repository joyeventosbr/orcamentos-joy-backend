import { z } from "zod";

export const updateCompanySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
});

export type UpdateCompanyDto = z.infer<typeof updateCompanySchema>;
