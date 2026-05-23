import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateSettingRequestApiDto {
  @ApiPropertyOptional()
  key?: string;

  @ApiPropertyOptional()
  value?: string;
}
