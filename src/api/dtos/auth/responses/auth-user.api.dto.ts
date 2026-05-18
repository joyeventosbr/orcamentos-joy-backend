import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@domain/users/enums/user-role.enum";

export class AuthUserApiDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: Role })
  role!: Role;

  @ApiProperty({ type: String, format: "date-time" })
  createdAt!: Date;
}
