// infra/database/typeorm/typeorm.config.ts
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserSchema } from "../schemas/user.schema";
import { CompanySchema } from "../schemas/company.schema";
import { EventSchema } from "../schemas/event.schema";
import { BudgetSchema } from "../schemas/budget.schema";
import { BudgetCategorySchema } from "../schemas/budget-category.schema";
import { BudgetLineItemSchema } from "../schemas/budget-line-item.schema";
import { CompanyEventSchema } from "../schemas/company-event.schema";
import { EventBudgetSchema } from "../schemas/event-budget.schema";
import { BudgetCategoryLinkSchema } from "../schemas/budget-category-link.schema";
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
    CompanySchema,
    EventSchema,
    BudgetSchema,
    BudgetCategorySchema,
    BudgetLineItemSchema,
    CompanyEventSchema,
    EventBudgetSchema,
    BudgetCategoryLinkSchema,
  ],
  synchronize: false,
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  migrationsTableName: "tb_migrations",
  extra: {
    connectionLimit: 20,
  },
  logging: true,
};
