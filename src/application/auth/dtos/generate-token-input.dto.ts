import type { Role } from "@domain/users/types/user-role.type";

export type GenerateTokenInputDto = {
  sub: string;
  email: string;
  role: Role;
  cdCliente?: string;
};
