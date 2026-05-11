# Rodando migracoes no banco

### Incremente a versao da migracao sempre: ex (migration_v001)

- Gere uma nova migracão rodando -> npm run migration:generate -- src/infra/database/typeorm/migrations/migration_v001
- Execute a alteração no banco com -> npm run migration:run -- --transaction each
