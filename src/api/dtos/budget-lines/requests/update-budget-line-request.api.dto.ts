import { ApiPropertyOptional } from "@nestjs/swagger";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";

export class UpdateBudgetLineRequestApiDto {
  @ApiPropertyOptional()
  categoryCode?: string;

  @ApiPropertyOptional({ nullable: true })
  parentId?: string | null;

  @ApiPropertyOptional()
  order?: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ enum: BillingType })
  billingType?: BillingType;

  @ApiPropertyOptional()
  quantity?: number;

  @ApiPropertyOptional()
  dailyRates?: number;

  @ApiPropertyOptional()
  unitValue?: number;

  @ApiPropertyOptional()
  totalValue?: number;

  @ApiPropertyOptional()
  upfrontPayment?: number;

  @ApiPropertyOptional()
  installment30Days?: number;

  @ApiPropertyOptional()
  installment45Days?: number;

  @ApiPropertyOptional()
  installment60Days?: number;

  @ApiPropertyOptional()
  installment90Days?: number;

  @ApiPropertyOptional()
  installment120Days?: number;

  @ApiPropertyOptional()
  billingUnitValue?: number;

  @ApiPropertyOptional()
  billingTotalValue?: number;
}
