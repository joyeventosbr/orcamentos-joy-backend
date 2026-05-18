# Joy Orcamentos Backend

Backend NestJS para gerenciamento de clientes, pastas, orcamentos, categorias globais e linhas de orcamento.

## Fluxo de orcamento

O fluxo atual e direto:

1. Criar um cliente.
2. Criar uma pasta vinculada ao cliente.
3. Criar categorias globais.
4. Criar um orcamento informando apenas `customerId` e `folderId`.
5. Atualizar os dados gerais do orcamento quando necessario.
6. Criar, editar ou remover `budget-lines` diretamente vinculadas ao orcamento.

Nao existe mais camada intermediaria de `BudgetDetail` ou `BudgetTable`. As linhas ficam vinculadas diretamente ao `Budget` pela tabela `tb_budget_lines`.

## Como iniciar

```bash
npm install
```

```bash
docker compose up -d
```

```bash
npm run migration:run -- --transaction each
```

```bash
npm run start:dev
```

## Scripts uteis

```bash
npm run build
```

```bash
npm run migration:generate -- src/infra/database/typeorm/migrations/migration_v001
```

```bash
npm run migration:run -- --transaction each
```

```bash
npm run seed:admin
```

## Observacao sobre testes

O comando de testes e:

```bash
npm test
```

No momento o projeto ainda nao possui arquivos `*.spec.ts`, entao o Jest encerra com `No tests found` ate que os primeiros testes sejam adicionados.
