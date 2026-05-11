import { Module } from "@nestjs/common";
import { InfraModule } from "@infra/infra.module";
import { RegisterUserUseCase } from "./users/usecases/register/register-user.usecase";
import { LoginUserUseCase } from "./users/usecases/login/login-user.usecase";
import { RegisterAdminUseCase } from "./users/usecases/register-admin/register-admin.usecase";
import { CreateBudgetUseCase } from "./budgets/usecases/create-budget/create-budget.usecase";
import { UpdateBudgetUseCase } from "./budgets/usecases/update-budget/update-budget.usecase";
import { DeleteBudgetUseCase } from "./budgets/usecases/delete-budget/delete-budget.usecase";
import { ExportBudgetUseCase } from "./budgets/usecases/export-budget/export-budget.usecase";
import { CreateEventUseCase } from "./budgets/usecases/create-event/create-event.usecase";
import { UpdateEventUseCase } from "./budgets/usecases/update-event/update-event.usecase";
import { DeleteEventUseCase } from "./budgets/usecases/delete-event/delete-event.usecase";
import { CreateCategoryUseCase } from "./budgets/usecases/create-category/create-category.usecase";
import { UpdateCategoryUseCase } from "./budgets/usecases/update-category/update-category.usecase";
import { DeleteCategoryUseCase } from "./budgets/usecases/delete-category/delete-category.usecase";

@Module({
  imports: [InfraModule],
  providers: [
    RegisterUserUseCase,
    RegisterAdminUseCase,
    LoginUserUseCase,
    CreateBudgetUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase,
    ExportBudgetUseCase,
    CreateEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    RegisterAdminUseCase,
    LoginUserUseCase,
    CreateBudgetUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase,
    ExportBudgetUseCase,
    CreateEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
  ],
})
export class UseCasesModule {}
