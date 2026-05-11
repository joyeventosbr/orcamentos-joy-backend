import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";

export class BudgetMapper {
  static toEntity(schema: BudgetSchema): Budget {
    return Budget.read({
      id: schema.id,
      eventId: "",
      client: schema.client,
      job: schema.job,
      deadline: schema.deadline,
      location: schema.location,
      eventDate: schema.eventDate,
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
      eventDate: entity.eventDate,
      participants: entity.participants,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
