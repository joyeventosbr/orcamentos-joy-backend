import type { Role } from "@domain/users/types/user-role.type";

export type JwtPayload = {
  sub: string;
  email: string;
  role: Role;
  cdCliente?: string;
};
