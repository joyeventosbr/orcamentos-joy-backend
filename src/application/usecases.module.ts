import { Module } from "@nestjs/common";
import { InfraModule } from "@infra/infra.module";
import { RegisterUserUseCase } from "./users/usecases/register/register-user.usecase";
import { LoginUserUseCase } from "./users/usecases/login/login-user.usecase";
import { RegisterAdminUseCase } from "./users/usecases/register-admin/register-admin.usecase";
import { CreateBudgetUseCase } from "./budgets/usecases/budget/create/create-budget.usecase";
import { UpdateBudgetUseCase } from "./budgets/usecases/budget/update/update-budget.usecase";
import { DeleteBudgetUseCase } from "./budgets/usecases/budget/delete/delete-budget.usecase";
import { ExportBudgetUseCase } from "./budgets/usecases/budget/export/export-budget.usecase";
import { GetBudgetUseCase } from "./budgets/usecases/budget/get/get-budget.usecase";
import { GetAllBudgetsUseCase } from "./budgets/usecases/budget/get-all/get-all-budgets.usecase";
import { CreateFolderUseCase } from "./budgets/usecases/folder/create/create-folder.usecase";
import { UpdateFolderUseCase } from "./budgets/usecases/folder/update/update-folder.usecase";
import { DeleteFolderUseCase } from "./budgets/usecases/folder/delete/delete-folder.usecase";
import { GetAllFoldersUseCase } from "./budgets/usecases/folder/get-all/get-all-folders.usecase";
import { CreateCategoryUseCase } from "./budgets/usecases/category/create/create-category.usecase";
import { UpdateCategoryUseCase } from "./budgets/usecases/category/update/update-category.usecase";
import { DeleteCategoryUseCase } from "./budgets/usecases/category/delete/delete-category.usecase";
import { CreateCustomerUseCase } from "./budgets/usecases/customer/create/create-customer.usecase";
import { UpdateCustomerUseCase } from "./budgets/usecases/customer/update/update-customer.usecase";
import { DeleteCustomerUseCase } from "./budgets/usecases/customer/delete/delete-customer.usecase";
import { GetAllCustomersUseCase } from "./budgets/usecases/customer/get-all/get-all-customers.usecase";

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
    GetBudgetUseCase,
    GetAllBudgetsUseCase,
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    GetAllFoldersUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    GetAllCustomersUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    RegisterAdminUseCase,
    LoginUserUseCase,
    CreateBudgetUseCase,
    UpdateBudgetUseCase,
    DeleteBudgetUseCase,
    ExportBudgetUseCase,
    GetBudgetUseCase,
    GetAllBudgetsUseCase,
    CreateFolderUseCase,
    UpdateFolderUseCase,
    DeleteFolderUseCase,
    GetAllFoldersUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    GetAllCustomersUseCase,
  ],
})
export class UseCasesModule {}
