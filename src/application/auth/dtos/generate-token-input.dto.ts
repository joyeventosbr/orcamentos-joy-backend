import type { Role } from "@domain/users/enums/user-role.enum";

export type GenerateTokenInputDto = {
  sub: string;
  email: string;
  role: Role;
  cdCliente?: string;
};
