import { z } from "zod";

const categorySchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  code: z.string().trim().min(1),
  order: z.number().int().nonnegative(),
});

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

export const createBudgetSchema = z.object({
  eventId: z.string().trim().min(1),
  client: z.string().trim().min(1),
  job: z.string().trim().min(1),
  deadline: z.string().trim().min(1),
  location: z.string().trim().min(1),
  eventDate: z.string().trim().min(1),
  participants: z.number().int().nonnegative(),
  categories: z.array(categorySchema),
  items: z.array(lineItemSchema),
});

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
