import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EventSchema } from "./event.schema";
import { BudgetCategorySchema } from "./budget-category.schema";
import { BudgetLineItemSchema } from "./budget-line-item.schema";

@Entity("tb_budgets")
export class BudgetSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "event_id" })
  eventId: string;

  @ManyToOne(() => EventSchema)
  @JoinColumn({ name: "event_id" })
  event: EventSchema;

  @Column()
  client: string;

  @Column()
  job: string;

  @Column()
  deadline: string;

  @Column()
  location: string;

  @Column({ name: "event_date" })
  eventDate: string;

  @Column({ name: "participants", type: "int" })
  participants: number;

  @OneToMany(() => BudgetCategorySchema, (category) => category.budget, {
    cascade: true,
    eager: true,
  })
  categories: BudgetCategorySchema[];

  @OneToMany(() => BudgetLineItemSchema, (item) => item.budget, {
    cascade: true,
    eager: true,
  })
  items: BudgetLineItemSchema[];

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
