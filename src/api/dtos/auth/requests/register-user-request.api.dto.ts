import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterUserRequestApiDto {
  @ApiPropertyOptional({ enum: [3], description: "Perfil temporário" })
  role?: 3;

  @ApiPropertyOptional({ type: [String], format: "uuid" })
  folderIds?: string[];

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiProperty()
  roleDescription!: string;
}
