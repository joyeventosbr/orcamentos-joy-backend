import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_budgets")
export class BudgetSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  client!: string;

  @Column()
  job!: string;

  @Column()
  deadline!: string;

  @Column()
  location!: string;

  @Column({ name: "event_date" })
  eventDate!: string;

  @Column({ name: "participants", type: "int" })
  participants!: number;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
