import { Module } from "@nestjs/common";
import { InfraModule } from "@infra/infra.module";
import { RegisterUserUseCase } from "./users/usecases/register/register-user.usecase";
import { LoginUserUseCase } from "./users/usecases/login/login-user.usecase";
import { RegisterAdminUseCase } from "./users/usecases/register-admin/register-admin.usecase";
import { CreateBudgetUseCase } from "./budgets/usecases/budget/create/create-budget.usecase";
import { UpdateBudgetUseCase } from "./budgets/usecases/budget/update/update-budget.usecase";
import { DeleteBudgetUseCase } from "./budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "./budgets/usecases/budget/export/export-budget.usecase";
import { CreateBudgetLineUseCase } from "./budgets/usecases/budget-line/create/create-budget-line.usecase";
import { UpdateBudgetLineUseCase } from "./budgets/usecases/budget-line/update/update-budget-line.usecase";
import { DeleteBudgetLineUseCase } from "./budgets/usecases/budget-line/delete/delete-budget-line.usecase";
import { CreateFolderUseCase } from "./budgets/usecases/folder/create/create-folder.usecase";
import { UpdateFolderUseCase } from "./budgets/usecases/folder/update/update-folder.usecase";
import { DeleteFolderUseCase } from "./budgets/usecases/folder/delete/delete-folder.usecase";
import { CreateCategoryUseCase } from "./budgets/usecases/category/create/create-category.usecase";
import { UpdateCategoryUseCase } from "./budgets/usecases/category/update/update-category.usecase";
import { DeleteCategoryUseCase } from "./budgets/usecases/category/delete/delete-category.usecase";
import { CreateCustomerUseCase } from "./budgets/usecases/customer/create/create-customer.usecase";
import { UpdateCustomerUseCase } from "./budgets/usecases/customer/update/update-customer.usecase";
import { DeleteCustomerUseCase } from "./budgets/usecases/customer/delete/delete-customer.usecase";

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
    CreateBudgetLineUseCase,
    UpdateBudgetLineUseCase,
    DeleteBudgetLineUseCase,
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    RegisterAdminUseCase,
    LoginUserUseCase,
    CreateBudgetUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase,
    ExportBudgetUseCase,
    CreateBudgetLineUseCase,
    UpdateBudgetLineUseCase,
    DeleteBudgetLineUseCase,
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
})
export class UseCasesModule {}
