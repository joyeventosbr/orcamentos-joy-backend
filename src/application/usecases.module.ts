import { Module } from "@nestjs/common";
import { InfraModule } from "@infra/infra.module";
import { RegisterUserUseCase } from "./users/usecases/register/register-user.usecase";
import { LoginUserUseCase } from "./users/usecases/login/login-user.usecase";
import { RegisterAdminUseCase } from "./users/usecases/register-admin/register-admin.usecase";
import { CreateBudgetUseCase } from "./budgets/usecases/budget/create/create-budget.usecase";
import { UpdateBudgetUseCase } from "./budgets/usecases/budget/update/update-budget.usecase";
import { DeleteBudgetUseCase } from "./budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "./budgets/usecases/budget/export/export-budget.usecase";
import { CreateEventUseCase } from "./budgets/usecases/event/create/create-event.usecase";
import { UpdateEventUseCase } from "./budgets/usecases/event/update/update-event.usecase";
import { DeleteEventUseCase } from "./budgets/usecases/event/delete/delete-event.usecase";
import { CreateCategoryUseCase } from "./budgets/usecases/category/create/create-category.usecase";
import { UpdateCategoryUseCase } from "./budgets/usecases/category/update/update-category.usecase";
import { DeleteCategoryUseCase } from "./budgets/usecases/category/delete/delete-category.usecase";
import { CreateCompanyUseCase } from "./budgets/usecases/company/create/create-company.usecase";
import { UpdateCompanyUseCase } from "./budgets/usecases/company/update/update-company.usecase";
import { DeleteCompanyUseCase } from "./budgets/usecases/company/delete/delete-company.usecase";

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
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
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
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
  ],
})
export class UseCasesModule {}
