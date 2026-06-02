import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BudgetLine } from "@domain/budgets/entities/budget-line.entity";
import { BillingType } from "@domain/budgets/enums/billing-type.enum";
import type { IBudgetLineRepository } from "@domain/budgets/repositories/i-budget-line-repository";
import { Result } from "@shared/result";
import { In, Repository } from "typeorm";
import { BudgetLineSchema } from "@infra/database/typeorm/schemas/budget-line.schema";

@Injectable()
export class BudgetLineRepository implements IBudgetLineRepository {
  constructor(
    @InjectRepository(BudgetLineSchema)
    private readonly budgetLineSchemaRepository: Repository<BudgetLineSchema>,
  ) {}

  async create(data: BudgetLine): Promise<Result<BudgetLine>> {
    try {
      const saved = await this.budgetLineSchemaRepository.save(
        this.toSchema(data),
      );
      return Result.success(this.toEntity(saved));
    } catch (error) {
      return Result.failure(
        "Falha ao criar linha do orçamento, erro: " + error,
      );
    }
  }

  async createMany(data: BudgetLine[]): Promise<Result<BudgetLine[]>> {
    try {
      const saved = await this.budgetLineSchemaRepository.manager.transaction(
        async (manager) =>
          manager
            .getRepository(BudgetLineSchema)
            .save(data.map((line) => this.toSchema(line))),
      );

      return Result.success(saved.map((line) => this.toEntity(line)));
    } catch (error) {
      return Result.failure(
        "Falha ao criar linhas do orçamento, erro: " + error,
      );
    }
  }

  async bulkSave(data: {
    create: BudgetLine[];
    update: BudgetLine[];
    deleteIds: string[];
  }): Promise<Result<BudgetLine[]>> {
    try {
      const saved = await this.budgetLineSchemaRepository.manager.transaction(
        async (manager) => {
          const repository = manager.getRepository(BudgetLineSchema);

          if (data.deleteIds.length > 0) {
            await repository.delete({ id: In(data.deleteIds) });
          }

          const linesToSave = [...data.create, ...data.update];
          if (linesToSave.length === 0) return [];

          return repository.save(
            linesToSave.map((line) => this.toSchema(line)),
          );
        },
      );

      return Result.success(saved.map((line) => this.toEntity(line)));
    } catch (error) {
      return Result.failure(
        "Falha ao editar linhas do orçamento em massa, erro: " + error,
      );
    }
  }

  async update(data: BudgetLine): Promise<Result<BudgetLine>> {
    try {
      const saved = await this.budgetLineSchemaRepository.save(
        this.toSchema(data),
      );
      return Result.success(this.toEntity(saved));
    } catch (error) {
      return Result.failure(
        "Falha ao atualizar linha do orçamento, erro: " + error,
      );
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.budgetLineSchemaRepository.delete({ id });
      return Result.success();
    } catch (error) {
      return Result.failure(
        "Falha ao remover linha do orçamento, erro: " + error,
      );
    }
  }

  async getById(id: string): Promise<Result<BudgetLine | null>> {
    try {
      const line = await this.budgetLineSchemaRepository.findOne({
        where: { id },
      });
      return Result.success(line ? this.toEntity(line) : null);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar linha do orçamento, erro: " + error,
      );
    }
  }

  async getAllByBudgetId(budgetId: string): Promise<Result<BudgetLine[]>> {
    try {
      const lines = await this.budgetLineSchemaRepository.find({
        where: { budgetId },
        order: { categoryCode: "ASC", parentId: "ASC", order: "ASC" },
      });

      return Result.success(lines.map((line) => this.toEntity(line)));
    } catch (error) {
      return Result.failure(
        "Falha ao listar linhas do orçamento, erro: " + error,
      );
    }
  }

  private toSchema(data: BudgetLine): Partial<BudgetLineSchema> {
    return {
      id: data.id || undefined,
      budgetId: data.budgetId,
      categoryCode: data.categoryCode,
      parentId: data.parentId,
      order: data.order,
      name: data.name,
      description: data.description,
      billingType: data.billingType,
      quantity: data.quantity,
      dailyRates: data.dailyRates,
      unitValue: data.unitValue,
      totalValue: data.totalValue,
      upfrontPayment: data.upfrontPayment,
      installment30Days: data.installment30Days,
      installment45Days: data.installment45Days,
      installment60Days: data.installment60Days,
      installment90Days: data.installment90Days,
      installment120Days: data.installment120Days,
      billingUnitValue: data.billingUnitValue,
      billingTotalValue: data.billingTotalValue,
    };
  }

  private toEntity(data: BudgetLineSchema): BudgetLine {
    return BudgetLine.read({
      id: data.id,
      budgetId: data.budgetId,
      categoryCode: data.categoryCode,
      parentId: data.parentId,
      order: data.order,
      name: data.name,
      description: data.description,
      billingType: data.billingType as BillingType | null,
      quantity: data.quantity,
      dailyRates: data.dailyRates,
      unitValue: data.unitValue,
      totalValue: data.totalValue,
      upfrontPayment: data.upfrontPayment,
      installment30Days: data.installment30Days,
      installment45Days: data.installment45Days,
      installment60Days: data.installment60Days,
      installment90Days: data.installment90Days,
      installment120Days: data.installment120Days,
      billingUnitValue: data.billingUnitValue,
      billingTotalValue: data.billingTotalValue,
    });
  }
}
