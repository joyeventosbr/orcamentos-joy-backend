import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_settings")
@Index("UQ_tb_settings_key", ["key"], { unique: true })
export class SettingSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
