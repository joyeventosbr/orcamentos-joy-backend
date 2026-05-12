import { Result } from "@shared/result";
import { BudgetCategory } from "./budget-category.entity";
import { BudgetLineItem } from "./budget-line-item.entity";

export class Budget {
  private constructor(
    public id: string,
    public folderId: string,
    public client: string,
    public job: string,
    public deadline: string,
    public location: string,
    public folderDate: string,
    public participants: number,
    public categories: BudgetCategory[],
    public items: BudgetLineItem[],
    public createdAt: Date,
    public updatedAt?: Date,
  ) {}

  static create(input: {
    folderId: string;
    client: string;
    job: string;
    deadline: string;
    location: string;
    folderDate: string;
    participants: number;
    categories: BudgetCategory[];
    items: BudgetLineItem[];
  }): Result<Budget> {
    if (!input.folderId?.trim()) return Result.failure("Pasta é obrigatória");
    if (!input.client?.trim()) return Result.failure("Cliente é obrigatório");
    if (!input.job?.trim()) return Result.failure("Job é obrigatório");
    if (!input.deadline?.trim()) return Result.failure("Prazo é obrigatório");
    if (!input.location?.trim()) return Result.failure("Local é obrigatório");
    if (!input.folderDate?.trim()) return Result.failure("Data é obrigatória");
    if (input.participants < 0)
      return Result.failure("Número de participantes inválido");

    return Result.success(
      new Budget(
        "",
        input.folderId,
        input.client.trim(),
        input.job.trim(),
        input.deadline.trim(),
        input.location.trim(),
        input.folderDate.trim(),
        input.participants,
        input.categories,
        input.items,
        new Date(),
      ),
    );
  }

  static read(input: {
    id: string;
    folderId: string;
    client: string;
    job: string;
    deadline: string;
    location: string;
    folderDate: string;
    participants: number;
    categories: BudgetCategory[];
    items: BudgetLineItem[];
    createdAt: Date;
    updatedAt?: Date;
  }): Budget {
    return new Budget(
      input.id,
      input.folderId,
      input.client,
      input.job,
      input.deadline,
      input.location,
      input.folderDate,
      input.participants,
      input.categories,
      input.items,
      input.createdAt,
      input.updatedAt,
    );
  }

  update(input: {
    folderId?: string;
    client?: string;
    job?: string;
    deadline?: string;
    location?: string;
    folderDate?: string;
    participants?: number;
    categories?: BudgetCategory[];
    items?: BudgetLineItem[];
  }): Result<Budget> {
    if (input.folderId !== undefined) {
      if (!input.folderId.trim()) return Result.failure("Pasta é obrigatória");
      this.folderId = input.folderId.trim();
    }

    if (input.client !== undefined) {
      if (!input.client.trim()) return Result.failure("Cliente é obrigatório");
      this.client = input.client.trim();
    }

    if (input.job !== undefined) {
      if (!input.job.trim()) return Result.failure("Job é obrigatório");
      this.job = input.job.trim();
    }

    if (input.deadline !== undefined) {
      if (!input.deadline.trim()) return Result.failure("Prazo é obrigatório");
      this.deadline = input.deadline.trim();
    }

    if (input.location !== undefined) {
      if (!input.location.trim()) return Result.failure("Local é obrigatório");
      this.location = input.location.trim();
    }

    if (input.folderDate !== undefined) {
      if (!input.folderDate.trim()) return Result.failure("Data é obrigatória");
      this.folderDate = input.folderDate.trim();
    }

    if (input.participants !== undefined) {
      if (input.participants < 0) {
        return Result.failure("Número de participantes inválido");
      }

      this.participants = input.participants;
    }

    if (input.categories !== undefined) this.categories = input.categories;
    if (input.items !== undefined) this.items = input.items;

    this.updatedAt = new Date();
    return Result.success(this);
  }
}
