import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";
import { BudgetLineDetailResponseDto } from "./budget-line-detail-response.dto";

export class BudgetDetailResponseDto {
  id!: string;
  name!: string;
  customerId!: string;
  customerName!: string;
  folderId!: string;
  folderName!: string;
  taxNf!: number;
  status!: BudgetStatus;
  isEditable!: boolean;
  parentId!: string | null;
  createdBy?: string;
  updatedBy?: string | null;
  createdAt!: Date;
  jobDescription?: string;
  location?: string;
  eventDate?: string;
  paymentTerm?: PaymentTerm;
  updatedAt?: Date;
  lines!: BudgetLineDetailResponseDto[];
}
