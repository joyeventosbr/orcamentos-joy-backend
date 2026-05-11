import { ApiProperty } from "@nestjs/swagger";

class BudgetCategoryApiDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  order: number;
}

class BudgetLineItemApiDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false, nullable: true })
  parentId?: string | null;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ["UNIT", "DAILY", "FIXED"] })
  billingType: "UNIT" | "DAILY" | "FIXED";

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  dailyRates: number;

  @ApiProperty()
  unitValue: number;

  @ApiProperty()
  totalValue: number;

  @ApiProperty()
  upfrontPayment: number;

  @ApiProperty()
  installment30Days: number;

  @ApiProperty()
  installment45Days: number;

  @ApiProperty()
  installment60Days: number;

  @ApiProperty()
  installment90Days: number;

  @ApiProperty()
  installment120Days: number;

  @ApiProperty()
  billingUnitValue: number;

  @ApiProperty()
  billingTotalValue: number;
}

export class CreateBudgetRequestApiDto {
  @ApiProperty()
  eventId: string;

  @ApiProperty()
  client: string;

  @ApiProperty()
  job: string;

  @ApiProperty()
  deadline: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  eventDate: string;

  @ApiProperty()
  participants: number;

  @ApiProperty({ type: [BudgetCategoryApiDto] })
  categories: BudgetCategoryApiDto[];

  @ApiProperty({ type: [BudgetLineItemApiDto] })
  items: BudgetLineItemApiDto[];
}
