import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { z } from "zod";

const lineItemSchema = z.object({
  id: z.string().trim().min(1),
  parentId: z.string().trim().optional().nullable(),
  categoryId: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
  name: z.string().trim().min(1),
  description: z.string().default(""),
  billingType: z.enum(["UNIT", "DAILY", "FIXED"]),
  quantity: z.number().nonnegative(),
  dailyRates: z.number().nonnegative(),
  unitValue: z.number().nonnegative(),
  totalValue: z.number().nonnegative(),
  upfrontPayment: z.number().nonnegative(),
  installment30Days: z.number().nonnegative(),
  installment45Days: z.number().nonnegative(),
  installment60Days: z.number().nonnegative(),
  installment90Days: z.number().nonnegative(),
  installment120Days: z.number().nonnegative(),
  billingUnitValue: z.number().nonnegative(),
  billingTotalValue: z.number().nonnegative(),
});

export const updateBudgetSchema = z.object({
  id: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  folderId: z.string().trim().min(1).optional(),
  jobDescription: z.string().trim().min(1).optional(),
  location: z.string().trim().min(1).optional(),
  eventDate: z.string().trim().min(1).optional(),
  paymentTerm: z.nativeEnum(PaymentTerm).optional(),
  items: z.array(lineItemSchema).optional(),
});

export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
