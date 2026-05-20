import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { CustomerSchema } from "./customer.schema";

@Entity("tb_budgets")
export class BudgetSchema {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ name: "customer_id" })
  customerId!: string;

  @ManyToOne(() => CustomerSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer!: CustomerSchema;

  @Column({ name: "job_description", nullable: true })
  jobDescription?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ name: "event_date", nullable: true })
  eventDate?: string;

  @Column({ name: "payment_term", nullable: true })
  paymentTerm?: PaymentTerm;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
