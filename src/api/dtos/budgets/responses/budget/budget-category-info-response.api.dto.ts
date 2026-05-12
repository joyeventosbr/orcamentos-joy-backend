import { ApiProperty } from "@nestjs/swagger";

export class BudgetCategoryInfoResponseApiDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  order!: number;
}
