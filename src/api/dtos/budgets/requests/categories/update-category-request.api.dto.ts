import { ApiProperty } from "@nestjs/swagger";

export class UpdateCategoryRequestApiDto {
  @ApiProperty()
  budgetId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  order: number;
}
