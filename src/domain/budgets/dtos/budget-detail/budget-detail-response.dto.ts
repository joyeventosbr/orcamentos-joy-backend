import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetLineDetailResponseDto } from "./budget-line-detail-response.dto";

export class BudgetDetailResponseDto {
  id!: string;
  name!: string;
  customerId!: string;
  customerName!: string;
  folderId!: string;
  folderName!: string;
  createdAt!: Date;
  jobDescription?: string;
  location?: string;
  eventDate?: string;
  paymentTerm?: PaymentTerm;
  updatedAt?: Date;
  lines!: BudgetLineDetailResponseDto[];
}
