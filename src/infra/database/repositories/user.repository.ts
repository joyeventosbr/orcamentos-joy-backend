import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@domain/users/entities/user/user.entity";
import { IUserRepository } from "@domain/users/repositories/i-user-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { UserSchema } from "../typeorm/schemas/user.schema";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userSchema: Repository<UserSchema>,
  ) {}

  async create(data: User): Promise<Result<User>> {
    try {
      const user = this.userSchema.create(UserMapper.toSchema(data));
      const savedUser = await this.userSchema.save(user);

      return Result.success(UserMapper.toEntity(savedUser));
    } catch (error) {
      return Result.failure(
        "Falha ao cadastrar usuário, erro: " + error?.message,
      );
    }
  }

  async getByEmail(email: string): Promise<Result<User | null>> {
    try {
      const user = await this.userSchema.findOne({
        where: { email: email.trim().toLowerCase() },
      });

      if (!user) {
        return Result.success(null);
      }

      return Result.success(UserMapper.toEntity(user));
    } catch (error) {
      return Result.failure(
        "Falha ao buscar usuário por email, erro: " + error?.message,
      );
    }
  }

  async getById(id: string): Promise<Result<User | null>> {
    try {
      const user = await this.userSchema.findOne({ where: { id } });

      if (!user) {
        return Result.success(null);
      }

      return Result.success(UserMapper.toEntity(user));
    } catch (error) {
      return Result.failure(
        "Falha ao buscar usuário por ID, erro: " + error?.message,
      );
    }
  }
}
