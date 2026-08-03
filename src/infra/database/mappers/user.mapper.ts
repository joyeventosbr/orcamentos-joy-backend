import { User } from "@domain/users/entities/user/user.entity";
import { UserListItemResponseDto } from "@domain/users/dtos/user-list-item-response.dto";
import { UserSchema } from "../typeorm/schemas/user.schema";

export class UserMapper {
  static toEntity(schema: UserSchema): User {
    return User.read({
      id: schema.id,
      name: schema.name,
      email: schema.email,
      password: schema.password,
      role: schema.role,
      createdAt: schema.createdAt,
      roleDescription: schema.roleDescription,
      updatedAt: schema.updatedAt,
    });
  }

  static toSchema(entity: User): UserSchema {
    const schema = new UserSchema();

    schema.name = entity.name;
    schema.email = entity.email;
    schema.password = entity.password;
    schema.role = entity.role;
    schema.createdAt = entity.createdAt;
    schema.roleDescription = entity.roleDescription;
    schema.updatedAt = entity.updatedAt;

    return schema;
  }

  static toListItemDto(schema: UserSchema): UserListItemResponseDto {
    return {
      id: schema.id,
      name: schema.name,
      email: schema.email,
      role: schema.role,
      roleDescription: schema.roleDescription,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    };
  }
}
