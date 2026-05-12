import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCategoryRequestApiDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional()
  order?: number;
}
