import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCustomerRequestApiDto {
  @ApiPropertyOptional()
  name?: string;
}
