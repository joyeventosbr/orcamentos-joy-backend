import { BillingType } from "@domain/budgets/enums/billing-type.enum";

export class BudgetLineDetailResponseDto {
  id!: string;
  budgetId!: string;
  categoryCode!: string;
  parentId!: string | null;
  order!: number;
  name!: string;
  description!: string;
  billingType!: BillingType | null;
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
  supplier!: string | null;
  supplierValue!: number | null;
  percentBv!: number | null;
  percentNfBv!: number | null;
  bvValue!: number | null;
  percentNfOver!: number | null;
  overValue!: number | null;
  realValue!: number | null;
}
