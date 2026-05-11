import { z } from "zod";

export const deleteCompanySchema = z.object({
  id: z.string().trim().min(1),
});

export type DeleteCompanyDto = z.infer<typeof deleteCompanySchema>;
