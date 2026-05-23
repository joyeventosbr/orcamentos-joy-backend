import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./typeorm/configs/typeorm.config";
import { type EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { BudgetRepository } from "./repositories/budget/budget.repository";
import { BudgetLineRepository } from "./repositories/budget-line/budget-line.repository";
import { CategoryRepository } from "./repositories/category/category.repository";
import { CustomerRepository } from "./repositories/customer/customer.repository";
import { FolderRepository } from "./repositories/folder/folder.repository";
import { BudgetRelationRepository } from "./repositories/relation/budget-relation.repository";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      ...(typeOrmConfig.entities as EntityClassOrSchema[]),
    ]),
  ],
  providers: [
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IBudgetRepository",
      useClass: BudgetRepository,
    },
    {
      provide: "IBudgetLineRepository",
      useClass: BudgetLineRepository,
    },
    {
      provide: "ICustomerRepository",
      useClass: CustomerRepository,
    },
    {
      provide: "IFolderRepository",
      useClass: FolderRepository,
    },
    {
      provide: "ICategoryRepository",
      useClass: CategoryRepository,
    },
    {
      provide: "IBudgetRelationRepository",
      useClass: BudgetRelationRepository,
    },
  ],
  exports: [
    "IUserRepository",
    "IBudgetRepository",
    "IBudgetLineRepository",
    "ICustomerRepository",
    "IFolderRepository",
    "ICategoryRepository",
    "IBudgetRelationRepository",
  ],
})
export class DatabaseModule {}
