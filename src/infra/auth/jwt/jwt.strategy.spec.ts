import { DataSource } from 'typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from '../../database/typeorm/schemas/user.schema';
import { Role } from '../../../domain/users/enums/user-role.enum';

describe('JwtStrategy: permissões vigentes', () => {
  const db = new DataSource({ type: 'postgres' });
  const payload = { sub: 'user', name: 'Freela', email: 'test@example.invalid', role: Role.ADMIN };
  let strategy: JwtStrategy;
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-only-secret';
    strategy = new JwtStrategy(db);
  });
  afterEach(() => jest.restoreAllMocks());
  it('rejeita sessão existente após desativação', async () => {
    jest.spyOn(db.getRepository(UserSchema), 'findOneBy').mockResolvedValue(Object.assign(new UserSchema(), { isActive: false }));
    await expect(strategy.validate(payload)).rejects.toThrow('Acesso desativado');
  });
  it('rejeita sessão de usuário excluído', async () => {
    jest.spyOn(db.getRepository(UserSchema), 'findOneBy').mockResolvedValue(null);
    await expect(strategy.validate(payload)).rejects.toThrow();
  });
  it('usa perfil e jobs atuais, sem confiar no perfil antigo do token', async () => {
    jest.spyOn(db.getRepository(UserSchema), 'findOneBy').mockResolvedValue(Object.assign(new UserSchema(), { isActive: true, role: Role.TEMPORARY, folderIds: ['job-atual'] }));
    await expect(strategy.validate(payload)).resolves.toMatchObject({ role: Role.TEMPORARY, folderIds: ['job-atual'] });
  });
});
