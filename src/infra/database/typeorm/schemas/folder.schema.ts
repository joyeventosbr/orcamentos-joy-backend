import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_folders")
export class FolderSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
