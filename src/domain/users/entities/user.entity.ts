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
    public cdEmpresa?: string,
    public updatedAt?: Date,
  ) {}

  static create({
    name,
    email,
    password,
    role,
    cdEmpresa,
  }: {
    name: string;
    email: string;
    password: string;
    role: Role;
    cdEmpresa?: string;
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

    if (role === Role.ENTERPRISE && !cdEmpresa?.trim()) {
      return Result.failure("Código da empresa é obrigatório");
    }

    return Result.success(
      new User(
        "",
        name.trim(),
        email.trim().toLowerCase(),
        password,
        role,
        new Date(),
        cdEmpresa,
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
    cdEmpresa?: string;
    updatedAt?: Date;
  }): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.role,
      userData.createdAt,
      userData.cdEmpresa,
      userData.updatedAt,
    );
  }
}
