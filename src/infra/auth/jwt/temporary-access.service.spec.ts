import { DataSource } from 'typeorm';
import { TemporaryAccessService } from './temporary-access.service';
import { FolderBudgetSchema } from '../../database/typeorm/schemas/folder-budget.schema';
import { UserSchema } from '../../database/typeorm/schemas/user.schema';
import { CustomerFolderSchema } from '../../database/typeorm/schemas/customer-folder.schema';

const folderId = '11111111-1111-4111-8111-111111111111';
const otherId = '22222222-2222-4222-8222-222222222222';
const budgetId = '33333333-3333-4333-8333-333333333333';
describe('TemporaryAccessService', () => {
  const db = new DataSource({ type: 'postgres' });
  const service = new TemporaryAccessService(db);
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(db.getRepository(FolderBudgetSchema), 'findOneBy').mockResolvedValue(Object.assign(new FolderBudgetSchema(), { budgetId, folderId }));
    jest.spyOn(db.getRepository(CustomerFolderSchema), 'findOneBy').mockResolvedValue(Object.assign(new CustomerFolderSchema(), { customerId: otherId, folderId }));
  });
  it.each(['GET', 'PUT', 'DELETE', 'POST', 'PATCH'])('permite operações %s no orçamento autorizado', async method => {
    await expect(service.authorize('BudgetsController', method, { id: budgetId }, {}, [folderId])).resolves.toBeUndefined();
  });
  it.each(['GET', 'PUT', 'DELETE', 'POST', 'PATCH'])('bloqueia operações %s fora do job', async method => {
    await expect(service.authorize('BudgetsController', method, { id: budgetId }, {}, [otherId])).rejects.toThrow('Acesso restrito');
  });
  it('bloqueia mudança para job não autorizado', async () => {
    await expect(service.authorize('BudgetsController', 'PUT', { id: budgetId }, { folderId: otherId }, [folderId])).rejects.toThrow();
  });
  it('bloqueia cliente incompatível com o job', async () => {
    await expect(service.authorize('BudgetsController', 'POST', {}, { folderId, customerId: folderId }, [folderId])).rejects.toThrow();
  });
  it('protege leitura e bulk de linhas', async () => {
    await expect(service.authorize('BudgetLinesController', 'GET', { budgetId }, {}, [otherId])).rejects.toThrow();
    await expect(service.authorize('BudgetLinesController', 'PUT', {}, { id: budgetId }, [otherId])).rejects.toThrow();
    await expect(service.authorize('BudgetLinesController', 'PUT', {}, { id: budgetId }, [folderId])).resolves.toBeUndefined();
  });
  it('bloqueia criação de jobs, administração e recursos desconhecidos', async () => {
    for (const resource of ['FoldersController', 'CustomersController', 'AuthController', 'UnknownController']) {
      await expect(service.authorize(resource, 'POST', {}, {}, [folderId])).rejects.toThrow();
    }
  });
  it('rejeita autorização com jobs inexistentes ou duplicados', async () => {
    jest.spyOn(db.getRepository(CustomerFolderSchema), 'findBy').mockResolvedValue([]);
    await expect(service.validateFolders([folderId])).rejects.toThrow();
    await expect(service.validateFolders([folderId, folderId])).rejects.toThrow();
  });
  it('desativa conta sem jobs e impede reativação sem escopo', async () => {
    jest.spyOn(db.getRepository(UserSchema), 'findOneBy').mockResolvedValue(Object.assign(new UserSchema(), { id: budgetId }));
    const update = jest.spyOn(db.getRepository(UserSchema), 'update').mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });
    await expect(service.update(budgetId, { folderIds: [], isActive: false })).resolves.toBeUndefined();
    expect(update).toHaveBeenCalledWith(budgetId, expect.objectContaining({ isActive: false, folderIds: [] }));
    jest.spyOn(db.getRepository(CustomerFolderSchema), 'findBy').mockResolvedValue([]);
    await expect(service.update(budgetId, { folderIds: [], isActive: true })).rejects.toThrow();
  });

});
