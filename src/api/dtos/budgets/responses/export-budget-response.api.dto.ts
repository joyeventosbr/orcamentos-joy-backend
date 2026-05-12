import { ApiProperty } from "@nestjs/swagger";

export class ExportBudgetResponseApiDto {
  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  content!: string;
}
