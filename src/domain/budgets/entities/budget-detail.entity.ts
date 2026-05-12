import { BudgetTableCategory } from "./budget-table-category.entity";

export class BudgetDetail {
  private constructor(
    public id: string,
    public folderId: string,
    public client: string,
    public job: string,
    public deadline: string,
    public location: string,
    public folderDate: string,
    public participants: number,
    public createdAt: Date,
    public updatedAt: Date | undefined,
    public table: BudgetTableCategory[],
  ) {}

  static read(input: {
    id: string;
    folderId: string;
    client: string;
    job: string;
    deadline: string;
    location: string;
    folderDate: string;
    participants: number;
    createdAt: Date;
    updatedAt: Date | undefined;
    table: BudgetTableCategory[];
  }): BudgetDetail {
    return new BudgetDetail(
      input.id,
      input.folderId,
      input.client,
      input.job,
      input.deadline,
      input.location,
      input.folderDate,
      input.participants,
      input.createdAt,
      input.updatedAt,
      input.table,
    );
  }
}
