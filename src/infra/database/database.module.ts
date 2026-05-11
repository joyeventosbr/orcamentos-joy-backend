import { Module } from "@nestjs/common";
import { IntegrationRepository } from "./repositories/integration.repository";
import { UserRepository } from "./repositories/user.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./typeorm/configs/typeorm.config";
import { type EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";
import { BudgetRepository } from "./repositories/budget.repository";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([
      ...(typeOrmConfig.entities as EntityClassOrSchema[]),
    ]),
  ],
  providers: [
    {
      provide: "IIntegrationRepository",
      useClass: IntegrationRepository,
    },
    {
      provide: "IUserRepository",
      useClass: UserRepository,
    },
    {
      provide: "IBudgetRepository",
      useClass: BudgetRepository,
    },
  ],
  exports: ["IIntegrationRepository", "IUserRepository", "IBudgetRepository"],
})
export class DatabaseModule {}
