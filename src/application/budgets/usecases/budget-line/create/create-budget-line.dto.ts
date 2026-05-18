import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { z } from "zod";

export const createBudgetLineSchema = z.object({
  budgetId: z.string().trim().min(1),
  categoryId: z.string().trim().min(1),
  parentId: z.string().trim().optional().nullable(),
  order: z.number().int().nonnegative(),
  name: z.string().trim().min(1),
  description: z.string().default(""),
  billingType: z.nativeEnum(BillingType),
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

export type CreateBudgetLineDto = z.infer<typeof createBudgetLineSchema>;
