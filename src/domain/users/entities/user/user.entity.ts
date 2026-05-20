import { Result } from "@shared/result";
import { Role } from "@domain/users/enums/user-role.enum";

export class User {
  private constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role,
    public createdAt: Date,
    public funcao?: string,
    public updatedAt?: Date,
  ) {}

  static create({
    name,
    email,
    password,
    role,
    funcao,
  }: {
    name: string;
    email: string;
    password: string;
    role: Role;
    funcao?: string;
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

    if (role === Role.CUSTOMER && !funcao?.trim()) {
      return Result.failure("Função é obrigatória");
    }

    return Result.success(
      new User(
        "",
        name.trim(),
        email.trim().toLowerCase(),
        password,
        role,
        new Date(),
        funcao?.trim(),
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
    funcao?: string;
    updatedAt?: Date;
  }): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.role,
      userData.createdAt,
      userData.funcao,
      userData.updatedAt,
    );
  }
}
