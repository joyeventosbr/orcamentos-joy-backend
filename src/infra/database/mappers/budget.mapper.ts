import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";

export class BudgetMapper {
  static toEntity(schema: BudgetSchema, folderId = ""): Budget {
    return Budget.read({
      id: schema.id,
      customerId: schema.customerId,
      folderId,
      jobDescription: schema.jobDescription,
      location: schema.location,
      eventDate: schema.eventDate,
      paymentTerm: schema.paymentTerm,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toSchema(entity: Budget): Partial<BudgetSchema> {
    return {
      id: entity.id || undefined,
      customerId: entity.customerId,
      jobDescription: entity.jobDescription,
      location: entity.location,
      eventDate: entity.eventDate,
      paymentTerm: entity.paymentTerm,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
