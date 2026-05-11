// infra/database/typeorm/typeorm.config.ts
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { IntegrationSchema } from "../schemas/integration.schema";
import { UserSchema } from "../schemas/user.schema";
import { CompanySchema } from "../schemas/company.schema";
import { EventSchema } from "../schemas/event.schema";
import { BudgetSchema } from "../schemas/budget.schema";
import { BudgetCategorySchema } from "../schemas/budget-category.schema";
import { BudgetLineItemSchema } from "../schemas/budget-line-item.schema";
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
    IntegrationSchema,
    UserSchema,
    CompanySchema,
    EventSchema,
    BudgetSchema,
    BudgetCategorySchema,
    BudgetLineItemSchema,
  ],
  synchronize: false,
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  migrationsTableName: "tb_migrations",
  extra: {
    connectionLimit: 20,
  },
  logging: true,
};
