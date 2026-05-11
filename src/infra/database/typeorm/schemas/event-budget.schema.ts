import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EventSchema } from "./event.schema";
import { BudgetSchema } from "./budget.schema";

@Entity("tb_events_budgets")
@Index("UQ_tb_events_budgets_budget_id", ["budgetId"], { unique: true })
export class EventBudgetSchema {
  @PrimaryColumn({ name: "event_id" })
  eventId!: string;

  @PrimaryColumn({ name: "budget_id" })
  budgetId!: string;

  @ManyToOne(() => EventSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: EventSchema;

  @ManyToOne(() => BudgetSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "budget_id" })
  budget!: BudgetSchema;
}
