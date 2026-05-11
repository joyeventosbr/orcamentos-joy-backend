import { User } from "@domain/users/entities/user.entity";
import { Result } from "@shared/result";

export interface IUserRepository {
  create(data: User): Promise<Result<User>>;
  getByEmail(email: string): Promise<Result<User | null>>;
  getById(id: string): Promise<Result<User | null>>;
}
