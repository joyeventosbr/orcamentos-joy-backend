import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CompanySchema } from "./company.schema";
import { EventSchema } from "./event.schema";

@Entity("tb_companies_events")
@Index("UQ_tb_companies_events_event_id", ["eventId"], { unique: true })
export class CompanyEventSchema {
  @PrimaryColumn({ name: "company_id" })
  companyId!: string;

  @PrimaryColumn({ name: "event_id" })
  eventId!: string;

  @ManyToOne(() => CompanySchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "company_id" })
  company!: CompanySchema;

  @ManyToOne(() => EventSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "event_id" })
  event!: EventSchema;
}
