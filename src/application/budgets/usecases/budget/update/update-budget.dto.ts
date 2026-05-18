import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { z } from "zod";

export const updateBudgetSchema = z.object({
  id: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  folderId: z.string().trim().min(1).optional(),
  jobDescription: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  eventDate: z.string().trim().min(1).optional(),
  paymentTerm: z.nativeEnum(PaymentTerm).optional(),
});

export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
