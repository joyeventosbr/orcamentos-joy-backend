import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./typeorm/configs/typeorm.config";
import { type EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { BudgetRepository } from "./repositories/budget/budget.repository";
import { BudgetCategoryRepository } from "./repositories/category/budget-category.repository";
import { CompanyRepository } from "./repositories/company/company.repository";
import { EventRepository } from "./repositories/event/event.repository";
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
      provide: "ICompanyRepository",
      useClass: CompanyRepository,
    },
    {
      provide: "IEventRepository",
      useClass: EventRepository,
    },
    {
      provide: "IBudgetCategoryRepository",
      useClass: BudgetCategoryRepository,
    },
    {
      provide: "IBudgetRelationRepository",
      useClass: BudgetRelationRepository,
    },
  ],
  exports: [
    "IUserRepository",
    "IBudgetRepository",
    "ICompanyRepository",
    "IEventRepository",
    "IBudgetCategoryRepository",
    "IBudgetRelationRepository",
  ],
})
export class DatabaseModule {}
