import { Module } from "@nestjs/common";
import { UseCasesModule } from "@application/usecases.module";
import { InfraModule } from "@infra/infra.module";
import { AuthController } from "./controllers/auth.controller";
import { RouterModule } from "@nestjs/core";
import { BudgetsController } from "./controllers/budgets.controller";
import { BudgetLinesController } from "./controllers/budget-lines.controller";
import { CategoriesController } from "./controllers/categories.controller";
import { CustomersController } from "./controllers/customers.controller";
import { FoldersController } from "./controllers/folders.controller";
import { SettingsController } from "./controllers/settings.controller";

@Module({
  imports: [
    UseCasesModule,
    InfraModule,
    RouterModule.register([
      {
        path: "api",
        module: ApiModule,
      },
    ]),
  ],
  controllers: [
    AuthController,
    BudgetsController,
    BudgetLinesController,
    CategoriesController,
    CustomersController,
    FoldersController,
    SettingsController,
  ],
})
export class ApiModule {}
