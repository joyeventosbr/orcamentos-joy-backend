import { User } from "@domain/users/entities/user/user.entity";
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
      cdCliente: schema.cdCliente,
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
    schema.cdCliente = entity.cdCliente;
    schema.updatedAt = entity.updatedAt;

    return schema;
  }
}
