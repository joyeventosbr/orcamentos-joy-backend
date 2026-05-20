import { Result } from "@shared/result";
import { PaymentTerm } from "@domain/budgets/enums/payment-term.enum";

export class Budget {
  private constructor(
    public id: string,
    public name: string,
    public customerId: string,
    public folderId: string,
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
  }): Result<Budget> {
    if (!input.name?.trim())
      return Result.failure("Nome do orçamento é obrigatório");
    if (!input.customerId?.trim())
      return Result.failure("Cliente é obrigatório");
    if (!input.folderId?.trim()) return Result.failure("Pasta é obrigatória");

    return Result.success(
      new Budget(
        "",
        input.name.trim(),
        input.customerId.trim(),
        input.folderId.trim(),
        new Date(),
      ),
    );
  }

  static read(input: {
    id: string;
    name: string;
    customerId: string;
    folderId: string;
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
  }): Result<Budget> {
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

    this.updatedAt = new Date();
    return Result.success(this);
  }
}
