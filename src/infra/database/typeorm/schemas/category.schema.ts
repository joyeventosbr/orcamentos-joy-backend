import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_categories")
export class CategorySchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ name: "order", type: "int" })
  order!: number;
}
