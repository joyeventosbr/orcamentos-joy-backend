import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetTableCategoryResponseApiDto } from "./budget-table-category-response.api.dto";

export class BudgetDetailResponseApiDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  folderId!: string;

  @ApiPropertyOptional()
  jobDescription?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  eventDate?: string;

  @ApiPropertyOptional({ enum: PaymentTerm })
  paymentTerm?: PaymentTerm;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;

  @ApiProperty({ type: [BudgetTableCategoryResponseApiDto] })
  table!: BudgetTableCategoryResponseApiDto[];
}
