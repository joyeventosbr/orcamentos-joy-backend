import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { CustomerSchema } from "./customer.schema";
import { FolderSchema } from "./folder.schema";

@Entity("tb_customers_folders")
@Index("UQ_tb_customers_folders_folder_id", ["folderId"], { unique: true })
export class CustomerFolderSchema {
  @PrimaryColumn({ name: "customer_id" })
  customerId!: string;

  @PrimaryColumn({ name: "folder_id" })
  folderId!: string;

  @ManyToOne(() => CustomerSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customer_id" })
  customer!: CustomerSchema;

  @ManyToOne(() => FolderSchema, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "folder_id" })
  folder!: FolderSchema;
}
