import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { z } from "zod";
import { Role } from "@domain/users/enums/user-role.enum";
import { UserSchema } from "@infra/database/typeorm/schemas/user.schema";
import { CustomerFolderSchema } from "@infra/database/typeorm/schemas/customer-folder.schema";
import { FolderBudgetSchema } from "@infra/database/typeorm/schemas/folder-budget.schema";

const accessSchema = z.object({
  folderIds: z.array(z.string().uuid()).max(500),
  isActive: z.boolean(),
});

@Injectable()
export class TemporaryAccessService {
  constructor(private readonly db: DataSource) {}

  async validateFolders(folderIds: string[]): Promise<void> {
    const rows = await this.db
      .getRepository(CustomerFolderSchema)
      .findBy({ folderId: In(folderIds) });
    if (
      !folderIds.length ||
      new Set(folderIds).size !== folderIds.length ||
      rows.length !== folderIds.length
    ) {
      throw new BadRequestException(
        "Selecione jobs cadastrados e sem duplicidade",
      );
    }
  }

  async update(id: string, input: unknown): Promise<void> {
    if (!z.string().uuid().safeParse(id).success)
      throw new BadRequestException("Usuário inválido");
    const parsed = accessSchema.safeParse(input);
    if (!parsed.success)
      throw new BadRequestException("Informe os jobs e o estado do acesso");
    if (parsed.data.isActive) await this.validateFolders(parsed.data.folderIds);
    const user = await this.db
      .getRepository(UserSchema)
      .findOneBy({ id, role: Role.TEMPORARY });
    if (!user) throw new NotFoundException("Perfil temporário não encontrado");
    await this.db
      .getRepository(UserSchema)
      .update(id, { ...parsed.data, updatedAt: new Date() });
  }

  async customers(folderIds: string[]): Promise<string[]> {
    const rows = await this.db
      .getRepository(CustomerFolderSchema)
      .findBy({ folderId: In(folderIds) });
    return rows.map((row) => row.customerId);
  }

  async authorize(
    resource: string,
    method: string,
    params: Record<string, string>,
    input: unknown,
    folderIds: string[],
  ): Promise<void> {
    const deny = () => {
      throw new ForbiddenException("Acesso restrito aos jobs autorizados");
    };
    const body = typeof input === "object" && input !== null ? input : {};
    const field = (key: string): unknown => Reflect.get(body, key);
    const checkFolder = (id: unknown) => {
      if (typeof id !== "string" || !folderIds.includes(id)) deny();
    };
    const checkBudget = async (id: unknown) => {
      if (typeof id !== "string" || !z.string().uuid().safeParse(id).success)
        return deny();
      const relation = await this.db
        .getRepository(FolderBudgetSchema)
        .findOneBy({ budgetId: id });
      checkFolder(relation?.folderId);
    };
    if (resource === "CustomersController") {
      if (method === "GET") return;
      if (
        method !== "PUT" ||
        !(await this.customers(folderIds)).includes(params.id)
      )
        return deny();
      return;
    }
    if (resource === "FoldersController") {
      if (method === "GET") return;
      if (method !== "PUT") return deny();
      checkFolder(params.id);
      if (field("customerId") !== undefined) {
        const relation = await this.db
          .getRepository(CustomerFolderSchema)
          .findOneBy({ folderId: params.id });
        if (field("customerId") !== relation?.customerId) deny();
      }
      return;
    }
    if (resource === "BudgetsController") {
      if (params.id) await checkBudget(params.id);
      else if (method !== "GET") checkFolder(field("folderId"));
      if (field("folderId") !== undefined) checkFolder(field("folderId"));
      if (
        field("customerId") !== undefined ||
        field("folderId") !== undefined
      ) {
        const current = params.id
          ? await this.db
              .getRepository(FolderBudgetSchema)
              .findOneBy({ budgetId: params.id })
          : null;
        const folderId =
          typeof field("folderId") === "string"
            ? String(field("folderId"))
            : current?.folderId;
        const relation = folderId
          ? await this.db
              .getRepository(CustomerFolderSchema)
              .findOneBy({ folderId })
          : null;
        if (
          field("customerId") !== undefined &&
          field("customerId") !== relation?.customerId
        )
          deny();
      }
      return;
    }
    if (resource === "BudgetLinesController") {
      await checkBudget(method === "GET" ? params.budgetId : field("id"));
      return;
    }
    if (
      (resource === "CategoriesController" ||
        resource === "SettingsController") &&
      method === "GET"
    )
      return;
    deny();
  }
}
