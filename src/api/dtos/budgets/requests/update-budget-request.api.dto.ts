import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetLineItemRequestApiDto } from "./budget-line-item-request.api.dto";

export class UpdateBudgetRequestApiDto {
  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  folderId?: string;

  @ApiPropertyOptional()
  jobDescription?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  eventDate?: string;

  @ApiPropertyOptional({ enum: PaymentTerm })
  paymentTerm?: PaymentTerm;

  @ApiPropertyOptional({ type: [BudgetLineItemRequestApiDto] })
  items?: BudgetLineItemRequestApiDto[];
}
