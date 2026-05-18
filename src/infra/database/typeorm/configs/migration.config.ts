import { DataSource } from "typeorm";
import { config } from "dotenv";
import { UserSchema } from "../schemas/user.schema";
import { CustomerSchema } from "../schemas/customer.schema";
import { FolderSchema } from "../schemas/folder.schema";
import { BudgetSchema } from "../schemas/budget.schema";
import { BudgetCategorySchema } from "../schemas/budget-category.schema";
import { BudgetLineItemSchema } from "../schemas/budget-line-item.schema";
import { CustomerFolderSchema } from "../schemas/customer-folder.schema";
import { FolderBudgetSchema } from "../schemas/folder-budget.schema";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT ?? "5432"),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    UserSchema,
    CustomerSchema,
    FolderSchema,
    BudgetSchema,
    BudgetCategorySchema,
    BudgetLineItemSchema,
    CustomerFolderSchema,
    FolderBudgetSchema,
  ],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  extra: {
    connectionLimit: 20,
  },
  migrationsTableName: "tb_migrations",
  logging: true,
  synchronize: false,
});
