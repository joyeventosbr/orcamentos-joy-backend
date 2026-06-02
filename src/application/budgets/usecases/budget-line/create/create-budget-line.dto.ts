import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { z } from "zod";

export const createBudgetLineSchema = z.object({
  budgetId: z.string().trim().min(1),
  categoryCode: z.string().trim().min(1),
  parentId: z.string().trim().optional().nullable(),
  order: z.number().int().nonnegative(),
  name: z.string().trim().min(1),
  description: z.string().optional(),
  billingType: z.nativeEnum(BillingType).optional().nullable(),
  quantity: z.number().nonnegative().optional(),
  dailyRates: z.number().nonnegative().optional(),
  unitValue: z.number().nonnegative().optional(),
  totalValue: z.number().nonnegative().optional(),
  upfrontPayment: z.number().nonnegative().optional(),
  installment30Days: z.number().nonnegative().optional(),
  installment45Days: z.number().nonnegative().optional(),
  installment60Days: z.number().nonnegative().optional(),
  installment90Days: z.number().nonnegative().optional(),
  installment120Days: z.number().nonnegative().optional(),
  billingUnitValue: z.number().nonnegative().optional(),
  billingTotalValue: z.number().nonnegative().optional(),
  supplier: z.string().trim().optional().nullable(),
  supplierValue: z.number().nonnegative().optional(),
  percentBv: z.number().nonnegative().optional(),
  percentNfOver: z.number().nonnegative().optional(),
});

export type CreateBudgetLineDto = z.infer<typeof createBudgetLineSchema>;
