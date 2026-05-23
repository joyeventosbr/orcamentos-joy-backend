import { ApiProperty } from "@nestjs/swagger";

export class SettingErrorApiResponseDto {
  @ApiProperty()
  error!: string;
}
