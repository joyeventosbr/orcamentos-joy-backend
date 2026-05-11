import { ApiProperty } from "@nestjs/swagger";
import { AuthUserApiDto } from "./auth-user.api.dto";

export class AuthResponseApiDto {
  @ApiProperty({ type: AuthUserApiDto })
  user!: AuthUserApiDto;

  @ApiProperty()
  token!: string;
}
