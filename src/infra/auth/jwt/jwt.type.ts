import type { Role } from "@domain/users/enums/user-role.enum";

export type JwtPayload = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  funcao?: string;
};
