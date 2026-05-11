import { DataSource } from "typeorm";
import { config } from "dotenv";
import { UserSchema } from "../schemas/user.schema";
import { CompanySchema } from "../schemas/company.schema";
import { EventSchema } from "../schemas/event.schema";
import { BudgetSchema } from "../schemas/budget.schema";
import { BudgetCategorySchema } from "../schemas/budget-category.schema";
import { BudgetLineItemSchema } from "../schemas/budget-line-item.schema";
import { CompanyEventSchema } from "../schemas/company-event.schema";
import { EventBudgetSchema } from "../schemas/event-budget.schema";
import { BudgetCategoryLinkSchema } from "../schemas/budget-category-link.schema";

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
    CompanySchema,
    EventSchema,
    BudgetSchema,
    BudgetCategorySchema,
    BudgetLineItemSchema,
    CompanyEventSchema,
    EventBudgetSchema,
    BudgetCategoryLinkSchema,
  ],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  extra: {
    connectionLimit: 20,
  },
  migrationsTableName: "tb_migrations",
  logging: true,
  synchronize: false,
});
