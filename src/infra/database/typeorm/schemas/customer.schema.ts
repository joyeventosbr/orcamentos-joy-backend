import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_customers")
export class CustomerSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
