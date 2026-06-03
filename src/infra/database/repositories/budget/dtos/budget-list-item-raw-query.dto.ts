import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";

export class BudgetListItemRawQueryDto {
  budget_id!: string;
  budget_name!: string;
  budget_customer_id!: string;
  budget_folder_id!: string;
  budget_tax_nf!: number;
  budget_status!: BudgetStatus;
  budget_is_editable!: boolean;
  budget_is_deletable!: boolean;
  budget_parent_id!: string | null;
  budget_version!: number;
  budget_created_by!: string;
  budget_updated_by!: string | null;
  budget_job_description!: string | null;
  budget_location!: string | null;
  budget_event_date!: string | null;
  budget_payment_term!: PaymentTerm | null;
  budget_created_at!: Date;
  budget_updated_at!: Date | null;
}
