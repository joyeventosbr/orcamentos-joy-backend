import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";

export class UpdateBudgetRequestApiDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  folderId?: string;

  @ApiPropertyOptional()
  projectedValue?: number;

  @ApiPropertyOptional()
  jobDescription?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  eventDate?: string;

  @ApiPropertyOptional({ enum: PaymentTerm })
  paymentTerm?: PaymentTerm;
}
