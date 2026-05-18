import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetTableCategory } from "@domain/budgets/entities/budget-table-category.entity";

export class BudgetDetail {
  private constructor(
    public id: string,
    public customerId: string,
    public folderId: string,
    public createdAt: Date,
    public updatedAt: Date | undefined,
    public table: BudgetTableCategory[],
    public jobDescription?: string,
    public location?: string,
    public eventDate?: string,
    public paymentTerm?: PaymentTerm,
  ) {}

  static read(input: {
    id: string;
    customerId: string;
    folderId: string;
    createdAt: Date;
    updatedAt: Date | undefined;
    table: BudgetTableCategory[];
    jobDescription?: string;
    location?: string;
    eventDate?: string;
    paymentTerm?: PaymentTerm;
  }): BudgetDetail {
    return new BudgetDetail(
      input.id,
      input.customerId,
      input.folderId,
      input.createdAt,
      input.updatedAt,
      input.table,
      input.jobDescription,
      input.location,
      input.eventDate,
      input.paymentTerm,
    );
  }
}
