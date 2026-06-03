import { Result } from "@shared/result";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";
import { BudgetStatus } from "@domain/budgets/enums/budget-status.enum";

export class Budget {
  private constructor(
    public id: string,
    public name: string,
    public customerId: string,
    public folderId: string,
    public taxNf: number,
    public status: BudgetStatus,
    public isEditable: boolean,
    public parentId: string | null,
    public version: number,
    public createdBy: string,
    public updatedBy: string | null,
    public createdAt: Date,
    public jobDescription?: string,
    public location?: string,
    public eventDate?: string,
    public paymentTerm?: PaymentTerm,
    public updatedAt?: Date,
  ) {}

  static create(input: {
    name: string;
    customerId: string;
    folderId: string;
    taxNf: number;
    createdBy: string;
    version?: number;
    status?: BudgetStatus;
    parentId?: string | null;
    jobDescription?: string;
    location?: string;
    eventDate?: string;
    paymentTerm?: PaymentTerm;
  }): Result<Budget> {
    if (!input.name?.trim())
      return Result.failure("Nome do orçamento é obrigatório");
    if (!input.customerId?.trim())
      return Result.failure("Cliente é obrigatório");
    if (!input.folderId?.trim()) return Result.failure("Pasta é obrigatória");
    if (!Number.isFinite(input.taxNf) || input.taxNf <= 0) {
      return Result.failure("Taxa NF é obrigatória");
    }
    if (!input.createdBy?.trim())
      return Result.failure("Usuário de criação é obrigatório");

    const version = input.version ?? 1;
    if (!Number.isInteger(version) || version <= 0) {
      return Result.failure("Versão do orçamento é obrigatória");
    }

    const status = input.status ?? BudgetStatus.CONCORRENCIA;
    if (!Object.values(BudgetStatus).includes(status)) {
      return Result.failure("Status do orçamento inválido");
    }

    return Result.success(
      new Budget(
        "",
        input.name.trim(),
        input.customerId.trim(),
        input.folderId.trim(),
        input.taxNf,
        status,
        Budget.isEditableByStatus(status),
        input.parentId?.trim() ?? null,
        version,
        input.createdBy.trim(),
        null,
        new Date(),
        input.jobDescription?.trim(),
        input.location?.trim(),
        input.eventDate?.trim(),
        input.paymentTerm,
      ),
    );
  }

  static read(input: {
    id: string;
    name: string;
    customerId: string;
    folderId: string;
    taxNf: number;
    status: BudgetStatus;
    isEditable: boolean;
    parentId: string | null;
    version: number;
    createdBy: string;
    updatedBy: string | null;
    createdAt: Date;
    jobDescription?: string;
    location?: string;
    eventDate?: string;
    paymentTerm?: PaymentTerm;
    updatedAt?: Date;
  }): Budget {
    return new Budget(
      input.id,
      input.name,
      input.customerId,
      input.folderId,
      input.taxNf,
      input.status,
      input.isEditable,
      input.parentId,
      input.version,
      input.createdBy,
      input.updatedBy,
      input.createdAt,
      input.jobDescription,
      input.location,
      input.eventDate,
      input.paymentTerm,
      input.updatedAt,
    );
  }

  update(input: {
    name?: string;
    customerId?: string;
    folderId?: string;
    jobDescription?: string;
    location?: string;
    eventDate?: string;
    paymentTerm?: PaymentTerm;
    updatedBy: string;
  }): Result<Budget> {
    if (!input.updatedBy?.trim())
      return Result.failure("Usuário de atualização é obrigatório");
    if (!this.isEditable) {
      return Result.failure("Orçamento não pode ser editado");
    }

    if (input.name !== undefined) {
      if (!input.name.trim()) {
        return Result.failure("Nome do orçamento é obrigatório");
      }
      this.name = input.name.trim();
    }

    if (input.customerId !== undefined) {
      if (!input.customerId.trim())
        return Result.failure("Cliente é obrigatório");
      this.customerId = input.customerId.trim();
    }

    if (input.folderId !== undefined) {
      if (!input.folderId.trim()) return Result.failure("Pasta é obrigatória");
      this.folderId = input.folderId.trim();
    }

    if (input.jobDescription !== undefined) {
      if (!input.jobDescription.trim()) {
        return Result.failure("Descrição do trabalho é obrigatória");
      }
      this.jobDescription = input.jobDescription.trim();
    }

    if (input.location !== undefined) {
      if (!input.location.trim()) return Result.failure("Local é obrigatório");
      this.location = input.location.trim();
    }

    if (input.eventDate !== undefined) {
      if (!input.eventDate.trim())
        return Result.failure("Data do evento é obrigatória");
      this.eventDate = input.eventDate.trim();
    }

    if (input.paymentTerm !== undefined) {
      if (!Object.values(PaymentTerm).includes(input.paymentTerm)) {
        return Result.failure("Prazo de pagamento inválido");
      }
      this.paymentTerm = input.paymentTerm;
    }

    return this.markUpdatedBy(input.updatedBy);
  }

  markUpdatedBy(updatedBy: string): Result<Budget> {
    if (!updatedBy?.trim()) {
      return Result.failure("Usuário de atualização é obrigatório");
    }

    this.updatedBy = updatedBy.trim();
    this.updatedAt = new Date();

    return Result.success(this);
  }

  private static isEditableByStatus(status: BudgetStatus): boolean {
    return ![
      BudgetStatus.APROVADO_CONCORRENCIA,
      BudgetStatus.APROVADO_PRODUCAO,
    ].includes(status);
  }
}
