import { ApiProperty } from "@nestjs/swagger";

export class CreateSettingRequestApiDto {
  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;
}
