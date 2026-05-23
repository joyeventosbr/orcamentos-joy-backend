import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";

export class BudgetDetailRawQueryDto {
  budget_id!: string;
  budget_name!: string;
  budget_customer_id!: string;
  budget_customer_name!: string;
  budget_folder_id!: string;
  budget_folder_name!: string;
  budget_job_description!: string | null;
  budget_location!: string | null;
  budget_event_date!: string | null;
  budget_payment_term!: PaymentTerm | null;
  budget_created_at!: Date;
  budget_updated_at!: Date | null;
  line_id!: string | null;
  line_budget_id!: string | null;
  line_category_code!: string | null;
  line_parent_id!: string | null;
  line_order!: number | null;
  line_name!: string | null;
  line_description!: string | null;
  line_billing_type!: BillingType | null;
  line_quantity!: number | null;
  line_daily_rates!: number | null;
  line_unit_value!: number | null;
  line_total_value!: number | null;
  line_upfront_payment!: number | null;
  line_installment_30_days!: number | null;
  line_installment_45_days!: number | null;
  line_installment_60_days!: number | null;
  line_installment_90_days!: number | null;
  line_installment_120_days!: number | null;
  line_billing_unit_value!: number | null;
  line_billing_total_value!: number | null;
}
