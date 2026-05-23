import { User } from "@domain/users/entities/user/user.entity";
import { UserListItemResponseDto } from "@domain/users/dtos/user-list-item-response.dto";
import { Result } from "@shared/result";

export interface IUserRepository {
  create(data: User): Promise<Result<User>>;
  getByEmail(email: string): Promise<Result<User | null>>;
  getById(id: string): Promise<Result<User | null>>;
  getAll(): Promise<Result<UserListItemResponseDto[]>>;
}
