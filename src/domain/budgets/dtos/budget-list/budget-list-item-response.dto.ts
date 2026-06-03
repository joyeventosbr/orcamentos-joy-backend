import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";

export class BudgetListItemResponseDto {
  id!: string;
  name!: string;
  customerId!: string;
  folderId!: string;
  taxNf!: number;
  status!: BudgetStatus;
  isEditable!: boolean;
  isDeletable!: boolean;
  parentId!: string | null;
  version!: number;
  createdBy?: string;
  updatedBy?: string | null;
  createdAt!: Date;
  jobDescription?: string;
  location?: string;
  eventDate?: string;
  paymentTerm?: PaymentTerm;
  updatedAt?: Date;
}
