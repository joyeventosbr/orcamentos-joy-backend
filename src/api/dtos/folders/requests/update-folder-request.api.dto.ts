import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateFolderRequestApiDto {
  @ApiPropertyOptional()
  customerId?: string;

  @ApiPropertyOptional()
  name?: string;
}
