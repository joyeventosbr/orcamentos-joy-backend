import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CompanySchema } from "./company.schema";

@Entity("tb_events")
export class EventSchema {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "company_id" })
  companyId: string;

  @ManyToOne(() => CompanySchema)
  @JoinColumn({ name: "company_id" })
  company: CompanySchema;

  @Column()
  name: string;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;
}
