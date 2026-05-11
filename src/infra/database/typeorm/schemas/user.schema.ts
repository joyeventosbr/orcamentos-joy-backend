import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@domain/users/types/user-role.type";

@Entity("tb_users")
export class UserSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "smallint", default: Role.ENTERPRISE })
  role: Role;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "cd_empresa", nullable: true })
  cdEmpresa?: string;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
