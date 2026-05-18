import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";

export class CreateBudgetLineRequestApiDto {
  @ApiProperty()
  budgetId!: string;

  @ApiProperty()
  categoryId!: string;

  @ApiPropertyOptional({ nullable: true })
  parentId?: string | null;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: BillingType })
  billingType!: BillingType;

  @ApiProperty()
  quantity!: number;

  @ApiProperty()
  dailyRates!: number;

  @ApiProperty()
  unitValue!: number;

  @ApiProperty()
  totalValue!: number;

  @ApiProperty()
  upfrontPayment!: number;

  @ApiProperty()
  installment30Days!: number;

  @ApiProperty()
  installment45Days!: number;

  @ApiProperty()
  installment60Days!: number;

  @ApiProperty()
  installment90Days!: number;

  @ApiProperty()
  installment120Days!: number;

  @ApiProperty()
  billingUnitValue!: number;

  @ApiProperty()
  billingTotalValue!: number;
}
