import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";

export class BudgetMapper {
  static toEntity(schema: BudgetSchema): Budget {
    return Budget.read({
      id: schema.id,
      folderId: "",
      client: schema.client,
      job: schema.job,
      deadline: schema.deadline,
      location: schema.location,
      folderDate: schema.folderDate,
      participants: schema.participants,
      categories: [],
      items: [],
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toSchema(entity: Budget): Partial<BudgetSchema> {
    return {
      id: entity.id || undefined,
      client: entity.client,
      job: entity.job,
      deadline: entity.deadline,
      location: entity.location,
      folderDate: entity.folderDate,
      participants: entity.participants,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
