import type { Role } from "@domain/users/enums/user-role.enum";

export type GenerateTokenInputDto = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  funcao?: string;
};
