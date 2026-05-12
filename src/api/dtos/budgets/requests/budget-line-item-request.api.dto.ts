import { ApiProperty } from "@nestjs/swagger";
import { BillingType } from "@domain/budgets/types/billing-type.type";

export class BudgetLineItemRequestApiDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false, nullable: true })
  parentId?: string | null;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  description!: string;

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
