# AGENTS.md — Joy Orçamentos Backend

Guia para agentes que alteram esta API. O frontend irmão fica em `../joy-orcamentos-frontend`; mudanças de contrato devem ser avaliadas e validadas nos dois repositórios.

## Produto e stack

Esta API atende o sistema interno de orçamentos da Joy Eventos: autenticação, usuários, clientes, pastas/jobs, categorias, orçamentos, linhas, aprovação, produção e parametrizações.

- NestJS 11 com adaptador Fastify e TypeScript 5.7;
- PostgreSQL 14 e TypeORM 0.3;
- Zod para validação de entrada, JWT/Passport, bcrypt, Swagger, CORS e rate limiting;
- aliases TypeScript: `@api`, `@application`, `@domain`, `@infra`, `@shared`, `@utils`.

`main.ts` inicia na porta `10000` por padrão, aplica CORS, multipart e Helmet em produção. A API usa prefixo `/api`; Swagger está em `/api/docs`.

## Arquitetura e dependências

Mantenha a direção `api -> application -> domain <- infra`:

- `src/api/`: controllers REST e DTOs de documentação;
- `src/application/`: use cases, DTOs Zod, factories e coordenação de regras;
- `src/domain/`: entidades, enums, validators e interfaces de repositório;
- `src/infra/`: JWT, banco, schemas TypeORM, mappers, repositórios e integrações;
- `src/infra/database/typeorm/migrations/`: migrations versionadas.

Controllers devem delegar a use cases/repositórios injetados e serializar `Result`; não coloque regra de negócio diretamente no controller. Entidades validam invariantes, use cases coordenam o fluxo e repositórios implementam interfaces de domínio. Preserve os tokens de DI existentes, como `IBudgetRepository`.

## Autenticação e dados sensíveis

- `JwtAuthGuard` é `APP_GUARD`: toda rota exige JWT, salvo as marcadas com `@Public()`.
- `@Admin()` exige `Role.ADMIN`. O frontend pode esconder ações, mas a autorização relevante deve permanecer no servidor.
- JWT usa `JWT_SECRET`. Banco usa `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD` e `POSTGRES_DB`; `PORT`, `CORS_ORIGIN`, `NODE_ENV` e `HTTP_TIMEOUT_MS` são adicionais.
- Nunca coloque tokens, senhas ou conteúdo de `.env` em código, logs, responses, fixtures ou documentação. Não registre payloads pessoais desnecessariamente.

## Banco e migrations

`synchronize` está desabilitado. Para um campo/tabela persistida, atualize de ponta a ponta:

1. entidade de domínio e schema TypeORM;
2. mapper e repositório, incluindo raw queries/respostas;
3. DTO/schema Zod e use case;
4. controller/response, quando exposto;
5. migration explícita em `src/infra/database/typeorm/migrations/`;
6. frontend irmão, tipos/mappers e fluxo save/reload se o contrato for consumido pela SPA.

Não dependa de `synchronize`, nem altere migrations já aplicadas. Revise a migration e execute-a apenas no banco apropriado. O Docker local contém PostgreSQL 14 em `5432`, banco `joy`.

## Contrato com o frontend

O frontend usa `VITE_API_URL` e centraliza as rotas em `../joy-orcamentos-frontend/src/api/endpoints.ts`. Ao mudar endpoint, payload, enum, status HTTP ou resposta, atualize/valide também:

- `src/types/api.types.ts`;
- request, caller, mappers e query keys/invalidações;
- UI de loading, erro, sucesso e permissões;
- save seguido de reload no editor de orçamento.

O fluxo crítico do editor usa `GET /budgets/:id/details`, atualiza cabeçalho e depois envia o diff de linhas por `PUT /budget-lines/bulk`. A API precisa continuar validando propriedade das linhas, editabilidade e regras de negócio; não introduza uma atualização parcial que deixe cabeçalho, linhas e auditoria incoerentes.

No estado atual, a SPA ainda tem declarações legadas para CRUD individual de `budget-lines`, mas o controller expõe leitura por orçamento e o bulk update. Confirme o controller antes de assumir que uma rota declarada no frontend existe. `honorariumPercentage` também é estado da UI hoje, sem contrato/persistência atual na API; persistí-lo exige mudança completa, não somente uma resposta adicional.

## Regras de orçamento

- Preserve `isEditable`, `isDeletable`, `status`, `version` e `parentId` como regras fornecidas pela API, não como convenções de UI.
- Aprovação direta para produção requer admin, orçamento raiz em concorrência, sem filhos e linhas válidas.
- Exclusão exige orçamento raiz, versão inicial e sem filhos.
- Mudanças em cálculos ou linhas devem considerar criação, cópia, aprovação, produção, exportação, auditoria e queries de detalhe/listagem.
- Ao tocar `Budget`, acompanhe entidade, `BudgetSchema`, `BudgetMapper`, repositório e DTOs/raw queries para evitar campo que salva mas não recarrega.

## Convenções

- Antes de editar, rode `git status` e procure implementações equivalentes com `rg`.
- Preserve alterações locais de terceiros e não faça refatoração ampla de estilo junto com alteração de regra.
- Use tipos explícitos; prefira `unknown` com narrowing a `any`. Não acrescente `@ts-ignore` ou casts para encobrir contrato quebrado.
- Reutilize enums, entidades, validators, mappers e interfaces existentes; não duplique strings de status, papel ou pagamento.
- Preserve `null`, `undefined`, vazio e zero quando tiverem semântica distinta.
- Use `Result` e mensagens de domínio para erros recuperáveis; não vaze detalhes internos do banco nas respostas.
- Não instale/remova dependências sem necessidade comprovada e autorização.

## Comandos e validação

Use npm, pois há `package-lock.json`:

```bash
npm ci
docker compose up -d
npm run migration:run -- --transaction each
npm run start:dev
npm run build
npm test
npm run test:e2e
npm run migration:show
git diff --check
```

`npm run lint` executa ESLint com `--fix`, portanto modifica arquivos: só o rode intencionalmente e revise o diff resultante. Jest está configurado, mas não há specs no estado atual; `npm test` pode encerrar com `No tests found`. Não reporte testes, migration aplicada ou QA integrado como concluídos sem executá-los.

Para mudanças full-stack, valide autenticação, autorização, erro HTTP, cache, save/reload, dirty/leave guard e os cálculos afetados na SPA. `npm run build` apenas confirma compilação; não comprova o comportamento real.

## Definition of done

- O fluxo completo e os consumidores foram inspecionados.
- Entidade, schema, mapper, repositório, DTO/use case e resposta continuam coerentes.
- Migração foi criada/revisada quando necessária e não há segredo no diff.
- Autorização e regras de domínio continuam no backend.
- Frontend foi atualizado/validado quando o contrato mudou.
- Foram executados `npm run build` e `git diff --check`, além de validações proporcionais; qualquer etapa não executada foi relatada objetivamente.
