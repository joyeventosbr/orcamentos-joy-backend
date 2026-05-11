import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("tb_integrations")
export class IntegrationSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  status: number;

  @Column({ type: "jsonb" })
  payload: Record<string, any>;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: "error", nullable: true })
  error?: string;

  @Column({ type: "jsonb", nullable: true })
  response?: Record<string, any>;
}
