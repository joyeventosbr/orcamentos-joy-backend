import { Result } from "@shared/result";
import { Role } from "../types/user-role.type";

export class User {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role,
    public createdAt: Date,
    public cdCliente?: string,
    public updatedAt?: Date,
  ) {}

  static create({
    name,
    email,
    password,
    role,
    cdCliente,
  }: {
    name: string;
    email: string;
    password: string;
    role: Role;
    cdCliente?: string;
  }): Result<User> {
    if (!name?.trim()) {
      return Result.failure("Nome é obrigatório");
    }

    if (!email?.trim()) {
      return Result.failure("Email é obrigatório");
    }

    if (!password?.trim()) {
      return Result.failure("Senha é obrigatória");
    }

    if (!role) {
      return Result.failure("Cargo é obrigatório");
    }

    if (role === Role.CUSTOMER && !cdCliente?.trim()) {
      return Result.failure("Código da cliente é obrigatório");
    }

    return Result.success(
      new User(
        "",
        name.trim(),
        email.trim().toLowerCase(),
        password,
        role,
        new Date(),
        cdCliente,
      ),
    );
  }

  static read(userData: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    cdCliente?: string;
    updatedAt?: Date;
  }): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.role,
      userData.createdAt,
      userData.cdCliente,
      userData.updatedAt,
    );
  }
}
