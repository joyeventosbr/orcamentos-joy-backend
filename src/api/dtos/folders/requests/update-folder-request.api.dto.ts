import { ApiProperty } from "@nestjs/swagger";

export class UpdateFolderRequestApiDto {
  @ApiProperty()
  name!: string;
}
