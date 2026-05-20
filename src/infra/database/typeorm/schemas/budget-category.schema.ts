import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_budget_categories")
export class BudgetCategorySchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  code!: string;

  @Column({ name: "order", type: "int" })
  order!: number;
}
