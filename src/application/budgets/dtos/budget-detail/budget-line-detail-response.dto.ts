import { BillingType } from "@domain/budgets/enums/billing-type.enum";

export class BudgetLineDetailResponseDto {
  id!: string;
  budgetId!: string;
  categoryCode!: string;
  parentId!: string | null;
  order!: number;
  name!: string;
  description!: string;
  billingType!: BillingType;
  quantity!: number;
  dailyRates!: number;
  unitValue!: number;
  totalValue!: number;
  upfrontPayment!: number;
  installment30Days!: number;
  installment45Days!: number;
  installment60Days!: number;
  installment90Days!: number;
  installment120Days!: number;
  billingUnitValue!: number;
  billingTotalValue!: number;
}
