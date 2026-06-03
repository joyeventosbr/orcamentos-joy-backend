import { Budget } from "@domain/budgets/entities/budget.entity";
import { BudgetSchema } from "../typeorm/schemas/budget.schema";

export class BudgetMapper {
  static toEntity(schema: BudgetSchema, folderId = ""): Budget {
    return Budget.read({
      id: schema.id,
      name: schema.name,
      customerId: schema.customerId,
      folderId,
      taxNf: schema.taxNf,
      status: schema.status,
      isEditable: schema.isEditable,
      parentId: schema.parentId,
      createdBy: schema.createdBy,
      updatedBy: schema.updatedBy,
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
      name: entity.name,
      customerId: entity.customerId,
      taxNf: entity.taxNf,
      status: entity.status,
      isEditable: entity.isEditable,
      parentId: entity.parentId,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      jobDescription: entity.jobDescription,
      location: entity.location,
      eventDate: entity.eventDate,
      paymentTerm: entity.paymentTerm,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
