import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserListItemResponseDto } from "@domain/users/dtos/user-list-item-response.dto";
import { Role } from "@domain/users/enums/user-role.enum";

export class UserListItemResponseApiDto extends UserListItemResponseDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare name: string;

  @ApiProperty()
  declare email: string;

  @ApiProperty({ enum: Role })
  declare role: Role;

  @ApiPropertyOptional()
  declare funcao?: string;

  @ApiProperty({ type: String, format: "date-time" })
  declare createdAt: Date;

  @ApiPropertyOptional({ type: String, format: "date-time" })
  declare updatedAt?: Date;
}
