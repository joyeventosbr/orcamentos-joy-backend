import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BudgetCategory } from "@domain/budgets/entities/budget-category.entity";
import { BudgetCategoryLink } from "@domain/budgets/entities/budget-category-link.entity";
import { BudgetLineItem } from "@domain/budgets/entities/budget-line-item.entity";
import { CustomerFolder } from "@domain/budgets/entities/customer-folder.entity";
import { FolderBudget } from "@domain/budgets/entities/folder-budget.entity";
import { BillingType } from "@domain/budgets/types/billing-type.type";
import type { IBudgetRelationRepository } from "@domain/budgets/repositories/relation/i-budget-relation-repository";
import { Result } from "@shared/result";
import { Repository } from "typeorm";
import { BudgetCategoryLinkSchema } from "@infra/database/typeorm/schemas/budget-category-link.schema";
import { BudgetLineItemSchema } from "@infra/database/typeorm/schemas/budget-line-item.schema";
import { CustomerFolderSchema } from "@infra/database/typeorm/schemas/customer-folder.schema";
import { FolderBudgetSchema } from "@infra/database/typeorm/schemas/folder-budget.schema";

@Injectable()
export class BudgetRelationRepository implements IBudgetRelationRepository {
  constructor(
    @InjectRepository(CustomerFolderSchema)
    private readonly customerFolderSchemaRepository: Repository<CustomerFolderSchema>,
    @InjectRepository(FolderBudgetSchema)
    private readonly folderBudgetSchemaRepository: Repository<FolderBudgetSchema>,
    @InjectRepository(BudgetCategoryLinkSchema)
    private readonly budgetCategoryLinkSchemaRepository: Repository<BudgetCategoryLinkSchema>,
    @InjectRepository(BudgetLineItemSchema)
    private readonly budgetLineItemSchemaRepository: Repository<BudgetLineItemSchema>,
  ) {}

  async createCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>> {
    try {
      const saved = await this.customerFolderSchemaRepository.save({
        customerId: data.customerId,
        folderId: data.folderId,
      });

      return Result.success(
        CustomerFolder.read({
          customerId: saved.customerId,
          folderId: saved.folderId,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular cliente e pasta, erro: " + error,
      );
    }
  }

  async createFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>> {
    try {
      const saved = await this.folderBudgetSchemaRepository.save({
        folderId: data.folderId,
        budgetId: data.budgetId,
      });

      return Result.success(
        FolderBudget.read({
          folderId: saved.folderId,
          budgetId: saved.budgetId,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular pasta e orçamento, erro: " + error,
      );
    }
  }

  async createBudgetCategoryLink(
    data: BudgetCategoryLink,
  ): Promise<Result<BudgetCategoryLink>> {
    try {
      const saved = await this.budgetCategoryLinkSchemaRepository.save({
        budgetId: data.budgetId,
        categoryId: data.categoryId,
      });

      return Result.success(
        BudgetCategoryLink.read({
          budgetId: saved.budgetId,
          categoryId: saved.categoryId,
        }),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao vincular orçamento e categoria, erro: " + error,
      );
    }
  }

  async replaceCustomerFolder(data: CustomerFolder): Promise<Result<CustomerFolder>> {
    await this.customerFolderSchemaRepository.delete({ folderId: data.folderId });
    return this.createCustomerFolder(data);
  }

  async replaceFolderBudget(data: FolderBudget): Promise<Result<FolderBudget>> {
    await this.folderBudgetSchemaRepository.delete({ budgetId: data.budgetId });
    return this.createFolderBudget(data);
  }

  async replaceBudgetCategoryLinks(
    budgetId: string,
    categories: BudgetCategory[],
  ): Promise<Result<void>> {
    try {
      await this.budgetCategoryLinkSchemaRepository.delete({ budgetId });

      if (categories.length > 0) {
        const links: BudgetCategoryLink[] = [];
        for (const category of categories) {
          const link = BudgetCategoryLink.create({
            budgetId,
            categoryId: category.id,
          });
          if (link.isFailure()) {
            return Result.failure(link.getError());
          }

          links.push(link.getValue());
        }

        await this.budgetCategoryLinkSchemaRepository.save(links);
      }

      return Result.success();
    } catch (error) {
      return Result.failure(
        "Falha ao substituir categorias do orçamento, erro: " + error,
      );
    }
  }

  async replaceBudgetLineItems(
    budgetId: string,
    items: BudgetLineItem[],
  ): Promise<Result<void>> {
    try {
      await this.budgetLineItemSchemaRepository.delete({ budgetId });

      if (items.length > 0) {
        await this.budgetLineItemSchemaRepository.save(
          items.map((item) => ({
            id: item.id || undefined,
            budgetId,
            categoryId: item.categoryId,
            parentId: item.parentId,
            order: item.order,
            name: item.name,
            description: item.description,
            billingType: item.billingType,
            quantity: item.quantity,
            dailyRates: item.dailyRates,
            unitValue: item.unitValue,
            totalValue: item.totalValue,
            upfrontPayment: item.upfrontPayment,
            installment30Days: item.installment30Days,
            installment45Days: item.installment45Days,
            installment60Days: item.installment60Days,
            installment90Days: item.installment90Days,
            installment120Days: item.installment120Days,
            billingUnitValue: item.billingUnitValue,
            billingTotalValue: item.billingTotalValue,
          })),
        );
      }

      return Result.success();
    } catch (error) {
      return Result.failure(
        "Falha ao substituir linhas do orçamento, erro: " + error,
      );
    }
  }

  async getCustomerIdByFolderId(folderId: string): Promise<Result<string | null>> {
    try {
      const customerFolder = await this.customerFolderSchemaRepository.findOne({
        where: { folderId },
      });

      return Result.success(customerFolder?.customerId ?? null);
    } catch (error) {
      return Result.failure("Falha ao buscar vínculo da pasta, erro: " + error);
    }
  }

  async getFolderIdByBudgetId(budgetId: string): Promise<Result<string | null>> {
    try {
      const folderBudget = await this.folderBudgetSchemaRepository.findOne({
        where: { budgetId },
      });

      return Result.success(folderBudget?.folderId ?? null);
    } catch (error) {
      return Result.failure(
        "Falha ao buscar vínculo do orçamento, erro: " + error,
      );
    }
  }

  async getCategoriesByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetCategory[]>> {
    try {
      const links = await this.budgetCategoryLinkSchemaRepository.find({
        where: { budgetId },
        relations: { category: true },
      });

      return Result.success(
        links
          .filter((link) => Boolean(link.category))
          .map(
            (link) =>
              BudgetCategory.read({
                id: link.category.id,
                name: link.category.name,
                code: link.category.code,
                order: link.category.order,
              }),
          ),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao buscar categorias do orçamento, erro: " + error,
      );
    }
  }

  async getLineItemsByBudgetId(
    budgetId: string,
  ): Promise<Result<BudgetLineItem[]>> {
    try {
      const items = await this.budgetLineItemSchemaRepository.find({
        where: { budgetId },
        order: { order: "ASC" },
      });

      return Result.success(
        items.map(
          (item) =>
            BudgetLineItem.read({
              id: item.id,
              budgetId: item.budgetId,
              categoryId: item.categoryId,
              parentId: item.parentId,
              order: item.order,
              name: item.name,
              description: item.description,
              billingType: item.billingType as BillingType,
              quantity: item.quantity,
              dailyRates: item.dailyRates,
              unitValue: item.unitValue,
              totalValue: item.totalValue,
              upfrontPayment: item.upfrontPayment,
              installment30Days: item.installment30Days,
              installment45Days: item.installment45Days,
              installment60Days: item.installment60Days,
              installment90Days: item.installment90Days,
              installment120Days: item.installment120Days,
              billingUnitValue: item.billingUnitValue,
              billingTotalValue: item.billingTotalValue,
            }),
        ),
      );
    } catch (error) {
      return Result.failure(
        "Falha ao buscar linhas do orçamento, erro: " + error,
      );
    }
  }
}
