// infra/database/typeorm/typeorm.config.ts
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserSchema } from "../schemas/user.schema";
import { CustomerSchema } from "../schemas/customer.schema";
import { FolderSchema } from "../schemas/folder.schema";
import { BudgetSchema } from "../schemas/budget.schema";
import { CategorySchema } from "../schemas/category.schema";
import { BudgetLineSchema } from "../schemas/budget-line.schema";
import { CustomerFolderSchema } from "../schemas/customer-folder.schema";
import { FolderBudgetSchema } from "../schemas/folder-budget.schema";
import { SettingSchema } from "../schemas/setting.schema";
import { config } from "dotenv";

config();

export const typeOrmConfig: TypeOrmModuleOptions = {
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
    CategorySchema,
    BudgetLineSchema,
    CustomerFolderSchema,
    FolderBudgetSchema,
    SettingSchema,
  ],
  synchronize: false,
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  migrationsTableName: "tb_migrations",
  extra: {
    connectionLimit: 20,
  },
  logging: true,
};
