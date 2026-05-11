import { Result } from "@shared/result";
import { BudgetCategory } from "./budget-category.entity";
import { BudgetLineItem } from "./budget-line-item.entity";

export class Budget {
  private constructor(
    public id: string,
    public eventId: string,
    public client: string,
    public job: string,
    public deadline: string,
    public location: string,
    public eventDate: string,
    public participants: number,
    public categories: BudgetCategory[],
    public items: BudgetLineItem[],
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}

  static create(input: {
    eventId: string;
    client: string;
    job: string;
    deadline: string;
    location: string;
    eventDate: string;
    participants: number;
    categories: BudgetCategory[];
    items: BudgetLineItem[];
  }): Result<Budget> {
    if (!input.eventId?.trim()) return Result.failure("Evento é obrigatório");
    if (!input.client?.trim()) return Result.failure("Cliente é obrigatório");
    if (!input.job?.trim()) return Result.failure("Job é obrigatório");
    if (!input.deadline?.trim()) return Result.failure("Prazo é obrigatório");
    if (!input.location?.trim()) return Result.failure("Local é obrigatório");
    if (!input.eventDate?.trim()) return Result.failure("Data é obrigatória");
    if (input.participants < 0)
      return Result.failure("Número de participantes inválido");

    return Result.success(
      new Budget(
        "",
        input.eventId,
        input.client.trim(),
        input.job.trim(),
        input.deadline.trim(),
        input.location.trim(),
        input.eventDate.trim(),
        input.participants,
        input.categories,
        input.items,
        new Date(),
      ),
    );
  }

  static read(input: {
    id: string;
    eventId: string;
    client: string;
    job: string;
    deadline: string;
    location: string;
    eventDate: string;
    participants: number;
    categories: BudgetCategory[];
    items: BudgetLineItem[];
    createdAt: Date;
    updatedAt?: Date;
  }): Budget {
    return new Budget(
      input.id,
      input.eventId,
      input.client,
      input.job,
      input.deadline,
      input.location,
      input.eventDate,
      input.participants,
      input.categories,
      input.items,
      input.createdAt,
      input.updatedAt,
    );
  }
}
