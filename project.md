# Joy Eventos - Sistema de Orçamentos

Documentação completa do frontend para guiar o desenvolvimento do backend.

---

## 1. Visão Geral

Sistema de gestão de orçamentos para a empresa **Joy Eventos**, uma produtora de eventos corporativos. O sistema permite criar, editar, duplicar e aprovar orçamentos de eventos organizados em uma hierarquia: **Cliente > Job > Orçamento**.

### Stack Frontend

- **React 19** + **TypeScript 5.8**
- **Vite 6** (bundler)
- **Tailwind CSS 4** (estilização)
- **AG Grid** (planilha do editor de orçamento)
- **React Router DOM 7** (rotas)
- **Lucide React** (ícones)
- **react-hot-toast** (notificações)
- **motion** (animações)
- **date-fns** (formatação de datas)

### Rotas do Frontend

| Rota                | Componente     | Descrição                                             |
| ------------------- | -------------- | ----------------------------------------------------- |
| `/login`            | `Login`        | Tela de login (nome + email)                          |
| `/`                 | `Dashboard`    | Dashboard com listagem de Clientes, Jobs e Orçamentos |
| `/editor`           | `BudgetEditor` | Criar novo orçamento                                  |
| `/editor/:budgetId` | `BudgetEditor` | Editar orçamento existente                            |

---

## 2. Modelo de Dados (TypeScript Types)

### 2.1 Enums / Union Types

```typescript
type BudgetStatus = "Concorrência" | "Aprovado" | "Produção";

type BudgetPhase = "concorrencia" | "producao";

const BUDGET_FOLDER_OPTIONS = [
  "concorrencia",
  "aprovados",
  "producao",
] as const;
type BudgetFolder = "concorrencia" | "aprovados" | "producao";

const BILLING_TYPE_OPTIONS = [
  "VIA CLIENTE",
  "ND OU REPASSE",
  "VIA NF",
  "OPCIONAL",
  "EXCLUÍDO",
] as const;
type BudgetBillingType =
  | "VIA CLIENTE"
  | "ND OU REPASSE"
  | "VIA NF"
  | "OPCIONAL"
  | "EXCLUÍDO";

const HONORARIUM_PERCENTAGE_OPTIONS = [10, 15, 20] as const;
type HonorariumPercentage = 10 | 15 | 20;
```

### 2.2 Entidades

#### Client

```typescript
interface Client {
  id: string;
  name: string;
  updatedAt: string; // ISO 8601
}
```

#### Job

```typescript
interface Job {
  id: string;
  clientId: string; // FK -> Client.id
  name: string;
  updatedAt: string; // ISO 8601
}
```

#### BudgetCategory (estático, pré-definido)

```typescript
interface BudgetCategory {
  id: string;
  name: string;
  sectionTitle?: string;
}
```

**Categorias fixas:**

| ID   | Nome                               |
| ---- | ---------------------------------- |
| 1.1  | Local \| Hotel \| Sala             |
| 1.2  | A&B                                |
| 1.3  | Técnica                            |
| 1.4  | Cenografia                         |
| 1.5  | Material Gráfico \| Promocional    |
| 1.6  | Conteúdo                           |
| 1.7  | Atração                            |
| 1.8  | Equipe de apoio                    |
| 1.9  | Logística                          |
| 1.10 | Taxas e licenças                   |
| 1.11 | Diversos                           |
| 1.12 | Extras                             |
| 2.1  | Serviços internos (NF Joy Eventos) |

> Categorias 1.x = fornecedores externos. Categoria 2.1 = serviços internos da Joy (sempre `billingType = "VIA NF"`).

#### BudgetItem

```typescript
interface BudgetItem {
  id: string;
  categoryId: string; // FK -> BudgetCategory.id
  itemNumber: string; // Ex: "1.1.3"
  name: string;
  description: string;
  billingType: BudgetBillingType | ""; // Pode ser vazio (não preenchido)
  quantity: number;
  days: number;
  unitPrice: number;
  total: number; // Calculado: quantity * days * unitPrice
  // Cronograma de pagamento
  paymentAdvance: number;
  payment30d: number;
  payment45d: number;
  payment60d: number;
  payment90d: number;
  payment120d: number;
  // Rentabilidade (fornecedor)
  fornecedorName: string;
  fornecedorValue: number; // Valor real pago ao fornecedor
  percentBV: number; // % BV (bonificação sobre volume)
  percentNfOver: number; // % NF Over
}
```

> **Cálculo do total:** `total = quantity * days * unitPrice`

#### BudgetEditor (quem editou)

```typescript
interface BudgetEditor {
  name: string;
  email: string;
}
```

#### Budget

```typescript
interface Budget {
  id: string;
  jobId: string; // FK -> Job.id
  name: string;
  status: BudgetStatus; // "Concorrência" | "Aprovado" | "Produção"
  phase: BudgetPhase; // "concorrencia" | "producao"
  isLocked: boolean; // true = somente leitura (orçamentos aprovados)
  sourceBudgetId?: string; // ID do orçamento de origem (quando é cópia)
  totalValue: number; // Soma de todos items.total
  lastUpdated: string; // ISO 8601
  lastEditedBy?: BudgetEditor;
  items: BudgetItem[];
  // Metadados do evento
  client?: string;
  job?: string;
  deadline?: string;
  location?: string;
  date?: string;
  participants?: string;
  honorariumPercentage?: HonorariumPercentage; // 10, 15 ou 20
}
```

#### CurrentUser (autenticação)

```typescript
interface CurrentUser {
  name: string;
  email: string;
}
```

### 2.3 Funções de Derivação

```typescript
// Determina em qual pasta/tab o orçamento aparece no dashboard
function getBudgetFolder(budget: Budget): BudgetFolder {
  if (budget.status === "Aprovado") return "aprovados";
  return budget.phase === "producao" ? "producao" : "concorrencia";
}

// Label de exibição do status (diferencia Aprovado Concorrência de Aprovado Produção)
function getApprovalLabel(budget: Budget): string {
  if (budget.status !== "Aprovado") return budget.status;
  return budget.phase === "concorrencia"
    ? "Aprovado Concorrência"
    : "Aprovado Produção";
}
```

---

## 3. Diagrama de Relacionamentos

```
Client (1) ──── (N) Job (1) ──── (N) Budget (1) ──── (N) BudgetItem
```

- Um **Client** possui muitos **Jobs**
- Um **Job** possui muitos **Budgets** (orçamentos/versões)
- Um **Budget** possui muitos **BudgetItems** (linhas do orçamento)
- Deletar um Client remove em cascata seus Jobs e Budgets
- Deletar um Job remove em cascata seus Budgets

---

## 4. API Esperada (Endpoints)

Baseado no `budgetService.ts` do frontend, o backend deve expor:

### 4.1 Dados Iniciais

```
GET /api/data
```

**Response:**

```json
{
  "clients": [Client],
  "jobs": [Job],
  "budgets": [Budget]
}
```

### 4.2 Client CRUD

```
POST   /api/clients          { name: string }             -> Client
DELETE /api/clients/:id                                    -> void
```

> DELETE cascateia para Jobs e Budgets do cliente.

### 4.3 Job CRUD

```
POST   /api/jobs             { clientId: string, name: string }  -> Job
DELETE /api/jobs/:id                                              -> void
```

> DELETE cascateia para Budgets do job.

### 4.4 Budget CRUD

```
POST   /api/budgets          { jobId: string, name: string }     -> Budget
PUT    /api/budgets/:id      Budget (body completo)               -> Budget
DELETE /api/budgets/:id                                           -> void
POST   /api/budgets/:id/duplicate                                 -> Budget
POST   /api/budgets/:id/approve                                   -> ApprovalResult
```

#### ApprovalResult

```typescript
interface ApprovalResult {
  approvedCopy: Budget; // Cópia aprovada (isLocked=true)
  productionCopy?: Budget; // Cópia para produção (só se phase="concorrencia")
}
```

---

## 5. Regras de Negócio

### 5.1 Criação de Orçamento

Ao criar um orçamento novo:

1. Status inicial: `"Concorrência"`
2. Phase inicial: `"concorrencia"`
3. `isLocked: false`
4. `honorariumPercentage: 10` (default)
5. Gerar itens padrão para todas as categorias:
   - Categorias 1.1 a 1.12: 1 item vazio cada
   - Categoria 2.1 (Serviços Internos): 30 itens pré-definidos com `billingType = "VIA NF"`

### 5.2 Template de Itens Padrão - Serviços Internos (cat 2.1)

Todos com `billingType = "VIA NF"`:

| #     | Nome                        | Descrição                                                                    |
| ----- | --------------------------- | ---------------------------------------------------------------------------- |
| 1     | Verba de produção           |                                                                              |
| 2     | Rádios HT                   |                                                                              |
| 3     | Clear com                   |                                                                              |
| 4     | Logística equipe            | Transporte equipe, evento e material evento                                  |
| 5     | Visita Técnica              | aéreo, terrestre, hospedagem                                                 |
| 6     | Produtor Executivo          |                                                                              |
| 7     | Produtor                    | Montagem e desmontagem                                                       |
| 8     | Produtor                    | Evento                                                                       |
| 9     | Produtor Financeiro         | orçamentos acima de 800k                                                     |
| 10    | Diretor técnico             |                                                                              |
| 11    | Diretor artístico           |                                                                              |
| 12    | Diretor artístico online    | qdo evento é híbrido                                                         |
| 13    | Roteiro MC                  | Considerar dias de evento - R$ 4.500,00/ dia                                 |
| 14    | Conteúdo Site               |                                                                              |
| 15    | Curadoria Site              | de acordo com cada assunto - avaliar a cada projeto                          |
| 16    | Projeto Técnico Cenográfico | valor Ademir                                                                 |
| 17    | Eletricista                 | avaliar necessidades ceno/técnica                                            |
| 18-25 | Pacote Criação              | KV, Save, Convite, Reminder, Crachá, Cordão crachá, Pacote cenográfico, Site |
| 26-30 | (vazio)                     |                                                                              |

### 5.3 Cálculo do Total de um Item

```
item.total = item.quantity * item.days * item.unitPrice
```

### 5.4 Duplicação de Orçamento

Ao duplicar um orçamento:

1. Cria uma cópia com novo ID
2. Incrementa versão no nome: `"Nome"` -> `"Nome v2"`, `"Nome v2"` -> `"Nome v3"`, etc.
3. Verifica nomes existentes no mesmo Job para determinar o próximo número
4. Status volta para `"Concorrência"`, `isLocked = false`
5. Todos os itens recebem novos IDs

### 5.5 Fluxo de Aprovação

Quando um orçamento é aprovado (`POST /api/budgets/:id/approve`):

#### Validações:

- O orçamento não pode já estar `isLocked`
- **Se phase = "concorrencia":** Não pode existir outro orçamento `Aprovado` na fase concorrência do mesmo Job
- **Se phase = "producao":** Não pode existir outro orçamento `Aprovado` na fase produção do mesmo Job

#### Resultado da aprovação:

1. **Sempre:** Cria uma **cópia aprovada** (`approvedCopy`):
   - Novo ID
   - `status = "Aprovado"`
   - `isLocked = true` (somente leitura)
   - `sourceBudgetId` = ID do orçamento original
   - Nome: `"[nome original] - Aprovado Concorrência"` ou `"[nome original] - Aprovado Produção"`

2. **Apenas se phase = "concorrencia":** Cria também uma **cópia de produção** (`productionCopy`):
   - Novo ID
   - `phase = "producao"`
   - `status = "Produção"`
   - `isLocked = false` (editável)
   - `sourceBudgetId` = ID do orçamento original
   - Nome: `"[nome original] - Produção"`

### 5.6 Pastas/Abas do Dashboard

Os orçamentos são organizados em 3 pastas:

- **Concorrência:** `status != "Aprovado"` AND `phase = "concorrencia"`
- **Aprovados:** `status = "Aprovado"` (qualquer phase)
- **Produção:** `status != "Aprovado"` AND `phase = "producao"`

### 5.7 Orçamento Bloqueado (`isLocked`)

Quando `isLocked = true`:

- O orçamento é somente leitura
- Não permite edição de itens
- Não permite exclusão
- Usado para orçamentos aprovados (snapshot histórico)

---

## 6. Cálculos Financeiros

### 6.1 Resumo de Faturamento (BillingSummaryCard)

Agrupa os itens do orçamento por `billingType`:

| billingType       | Grupo      | Descrição                                   |
| ----------------- | ---------- | ------------------------------------------- |
| `"VIA CLIENTE"`   | `client`   | Fornecedores pagos diretamente pelo cliente |
| `"ND OU REPASSE"` | `joy`      | Fornecedores via Joy (nota de débito)       |
| `"VIA NF"`        | `joy`      | Fornecedores via Joy (nota fiscal)          |
| `"OPCIONAL"`      | `optional` | Itens opcionais                             |
| `"EXCLUÍDO"`      | `excluded` | Itens excluídos                             |
| `""` (vazio)      | `unfilled` | Itens sem tipo de faturamento               |

**Imposto NF Joy (18%):** Aplicado sobre itens com `billingType = "VIA NF"`.

```
joyInvoiceTax = Σ(item.total * 0.18) para itens "VIA NF"
```

**Total Fornecedores:**

```
totalSuppliers = client.amount + joy.amount + joyInvoiceTax.amount
```

**Base para Honorários:**

```
honorariumBase = client.amount + joy.amount
```

**Pendências:** Itens com `total > 0` mas sem `billingType` preenchido.

### 6.2 Serviços Internos (InternalServicesSummaryCard)

Serviços da categoria 2.1:

```
internalItemsTotal = Σ(item.total) onde item.categoryId = "2.1"
planning = 0  (campo reservado)
fees = honorariumBase * (honorariumPercentage / 100)
administrativeTaxes = 0  (campo reservado)
subtotal = internalItemsTotal + planning + fees + administrativeTaxes
serviceTax = subtotal * 0.18  (ISS 18%)
totalEvent = subtotal + serviceTax
```

### 6.3 Cronograma de Pagamento (PaymentScheduleSummaryCard)

Soma de cada campo de pagamento dos itens:

| Campo            | Label      |
| ---------------- | ---------- |
| `paymentAdvance` | Antecipado |
| `payment30d`     | 30 dias    |
| `payment45d`     | 45 dias    |
| `payment60d`     | 60 dias    |
| `payment90d`     | 90 dias    |
| `payment120d`    | 120 dias   |

> Itens com `total < 0` são ignorados no cronograma.

### 6.4 Rentabilidade (ProfitabilitySidebar)

Para cada item (categorias 1.x apenas):

```
rsBV = fornecedorValue * (percentBV / 100)
over = fornecedorValue * (percentNfOver / 100)
valorReal = fornecedorValue - rsBV - over
```

**Totais gerais de rentabilidade:**

```
custosTerceirosJoy = Σ(item.fornecedorValue) de itens "VIA NF" ou "ND OU REPASSE"
impostoJoy18 = (custosTerceirosJoy + internalServicesCost) * 0.18

// BV/Over calculado sobre VALORES ORÇADOS (item.total)
bvOverPre = Σ(item.total * (percentBV/100) + item.total * (percentNfOver/100))

// BV/Over calculado sobre VALORES REAIS (item.fornecedorValue)
bvOverProd = Σ(item.fornecedorValue * (percentBV/100) + item.fornecedorValue * (percentNfOver/100))

impostoPreSobreBvOver = bvOverPre * 0.18
impostoProdSobreBvOver = bvOverProd * 0.18

rentabilidadePre = bvOverPre - impostoPreSobreBvOver
rentabilidadeProd = bvOverProd - impostoProdSobreBvOver

percentRentabilidadePre = (rentabilidadePre / (budgetGrandTotal - custosTerceirosJoy)) * 100
percentRentabilidadeProd = (rentabilidadeProd / budgetGrandTotal) * 100
```

---

## 7. Autenticação

Atualmente simples (nome + email), armazenado no `localStorage` com chave `joy:currentUser`.

### Fluxo:

1. Usuário faz login com nome e email
2. Dados são salvos no `localStorage`
3. O `currentUser` é usado para preencher `lastEditedBy` ao salvar orçamentos
4. Logout limpa o `localStorage`

### Interface para o Backend:

```typescript
interface CurrentUser {
  name: string;
  email: string;
}
```

> **Recomendação para backend:** Implementar autenticação real (JWT, OAuth, etc.) substituindo o localStorage. A interface `CurrentUser` pode ser expandida com `id`, `role`, etc.

---

## 8. Estrutura de Pastas do Frontend

```
src/
├── App.tsx                          # Rotas principais
├── main.tsx                         # Entry point
├── index.css                        # Tema/cores Tailwind
├── types.ts                         # Tipos globais
├── vite-env.d.ts
│
├── components/
│   ├── layout/
│   │   └── AppLayout/
│   │       └── AppLayout.tsx        # Layout com sidebar + Outlet
│   └── ui/
│       ├── Badge/Badge.tsx          # Badge de status
│       ├── Button/Button.tsx        # Botão genérico
│       ├── Card/Card.tsx            # Card container
│       └── Input/Input.tsx          # Input genérico
│
├── context/
│   ├── AppDataContext.tsx           # Provider global (clientes, jobs, budgets)
│   └── AuthContext.tsx              # Provider de autenticação
│
├── data/
│   └── mockData.ts                  # Dados mockados iniciais
│
├── hooks/
│   ├── useBudgetBillingSummary.ts   # Resumo de faturamento
│   ├── useDashboardFilters.ts       # Filtros do dashboard
│   ├── useInternalServicesSummary.ts # Resumo serviços internos
│   ├── usePaymentScheduleSummary.ts  # Cronograma de pagamento
│   └── useProfitabilitySummary.ts   # Cálculos de rentabilidade
│
├── lib/
│   ├── budgetFactory.ts             # Factory: criar/duplicar/aprovar budgets
│   ├── budgetStatus.ts              # Helpers de status/badges
│   ├── formatters.ts                # formatCurrencyBRL
│   └── utils.ts                     # cn() (classnames + tailwind-merge)
│
├── pages/
│   ├── BudgetEditor/
│   │   ├── BudgetEditor.tsx         # Página do editor
│   │   └── components/
│   │       ├── ApprovalConfirmModal.tsx
│   │       ├── BillingSummaryCard.tsx
│   │       ├── BudgetCategorySection.tsx
│   │       ├── BudgetEditorHeader.tsx
│   │       ├── BudgetSpreadsheet.tsx
│   │       ├── BudgetSummaryPanel.tsx
│   │       ├── BudgetTableCell.tsx
│   │       ├── DeleteCategoryModal.tsx
│   │       ├── InternalServicesSummaryCard.tsx
│   │       ├── PaymentScheduleSummaryCard.tsx
│   │       └── ProfitabilitySidebar.tsx
│   ├── Dashboard/
│   │   ├── Dashboard.tsx            # Página do dashboard
│   │   └── components/
│   │       ├── BudgetsView.tsx
│   │       ├── ClientsView.tsx
│   │       ├── CreateEntityModal.tsx
│   │       ├── DashboardHeader.tsx
│   │       ├── DashboardToolbar.tsx
│   │       └── JobsView.tsx
│   └── Login/
│       └── Login.tsx
│
└── services/
    ├── budgetService.ts             # Camada de serviço (chamadas API)
    └── mockApiClient.ts             # Simula delay de API (250ms)
```

---

## 9. Contrato do budgetService (Interface de Comunicação Frontend-Backend)

O frontend consome dados através do `budgetService.ts`. Atualmente ele usa dados mock em memória. O backend deve substituir com chamadas HTTP reais.

```typescript
const budgetService = {
  // Carrega todos os dados na inicialização
  getInitialData(): Promise<{ clients: Client[]; jobs: Job[]; budgets: Budget[] }>;

  // Client
  createClient(name: string): Promise<Client>;
  deleteClient(id: string): Promise<void>;

  // Job
  createJob(clientId: string, name: string): Promise<Job>;
  deleteJob(id: string): Promise<void>;

  // Budget
  createBudget(input: { jobId: string; name: string }): Promise<Budget>;
  updateBudget(id: string, budget: Budget, editor?: BudgetEditor): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;
  duplicateBudget(id: string): Promise<Budget | null>;
  approveBudget(id: string): Promise<ApprovalResult>;
};
```

### updateBudget: Comportamento Esperado

Ao atualizar um orçamento, o frontend envia o `Budget` completo (incluindo todos os `items`). O backend deve:

1. Substituir o orçamento inteiro (estratégia de "full replace")
2. Atualizar `lastUpdated` com timestamp do servidor
3. Se `editor` for fornecido, salvar em `lastEditedBy`
4. Retornar o orçamento atualizado

---

## 10. Constantes Importantes

| Constante                       | Valor        | Uso                                   |
| ------------------------------- | ------------ | ------------------------------------- |
| `JOY_INVOICE_TAX_RATE`          | 0.18 (18%)   | Imposto NF sobre itens "VIA NF"       |
| `SERVICE_TAX_RATE`              | 0.18 (18%)   | ISS sobre serviços internos           |
| `TAX_RATE` (rentabilidade)      | 0.18 (18%)   | Imposto para cálculo de rentabilidade |
| `INTERNAL_SERVICES_CATEGORY_ID` | "2.1"        | Categoria de serviços internos        |
| `HONORARIUM_PERCENTAGE_OPTIONS` | [10, 15, 20] | Opções de % de honorários             |
| `MOCK_API_DELAY_MS`             | 250          | Delay simulado (ignorar no backend)   |

---

## 11. Moeda e Localização

- **Moeda:** BRL (Real Brasileiro)
- **Formatação:** `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- **Idioma da interface:** Português do Brasil
- **Timezone:** Usar ISO 8601 para timestamps

---

## 12. Sugestões para o Backend

### Banco de Dados (schema sugerido)

```sql
-- Tabela de usuários
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes
CREATE TABLE clients (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs (projetos)
CREATE TABLE jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Orçamentos
CREATE TABLE budgets (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id                  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  name                    VARCHAR(255) NOT NULL,
  status                  VARCHAR(50) NOT NULL DEFAULT 'Concorrência',
  phase                   VARCHAR(50) NOT NULL DEFAULT 'concorrencia',
  is_locked               BOOLEAN NOT NULL DEFAULT FALSE,
  source_budget_id        UUID REFERENCES budgets(id) ON DELETE SET NULL,
  total_value             DECIMAL(15,2) NOT NULL DEFAULT 0,
  honorarium_percentage   INTEGER DEFAULT 10 CHECK (honorarium_percentage IN (10, 15, 20)),
  -- Metadados do evento
  client_label            VARCHAR(255),
  job_label               VARCHAR(255),
  deadline                VARCHAR(255),
  location                VARCHAR(255),
  event_date              VARCHAR(255),
  participants            VARCHAR(255),
  -- Auditoria
  last_edited_by_name     VARCHAR(255),
  last_edited_by_email    VARCHAR(255),
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do orçamento
CREATE TABLE budget_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id         UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category_id       VARCHAR(10) NOT NULL,
  item_number       VARCHAR(20) NOT NULL,
  name              VARCHAR(255) NOT NULL DEFAULT '',
  description       TEXT NOT NULL DEFAULT '',
  billing_type      VARCHAR(50) NOT NULL DEFAULT '',
  quantity          DECIMAL(10,2) NOT NULL DEFAULT 1,
  days              DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price        DECIMAL(15,2) NOT NULL DEFAULT 0,
  total             DECIMAL(15,2) NOT NULL DEFAULT 0,
  -- Cronograma de pagamento
  payment_advance   DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_30d       DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_45d       DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_60d       DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_90d       DECIMAL(15,2) NOT NULL DEFAULT 0,
  payment_120d      DECIMAL(15,2) NOT NULL DEFAULT 0,
  -- Rentabilidade
  fornecedor_name   VARCHAR(255) NOT NULL DEFAULT '',
  fornecedor_value  DECIMAL(15,2) NOT NULL DEFAULT 0,
  percent_bv        DECIMAL(5,2) NOT NULL DEFAULT 0,
  percent_nf_over   DECIMAL(5,2) NOT NULL DEFAULT 0,
  -- Ordenação
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_budgets_job_id ON budgets(job_id);
CREATE INDEX idx_budget_items_budget_id ON budget_items(budget_id);
CREATE INDEX idx_budget_items_category_id ON budget_items(category_id);
```

### Validações no Backend

1. **billingType** deve ser um dos valores: `"VIA CLIENTE"`, `"ND OU REPASSE"`, `"VIA NF"`, `"OPCIONAL"`, `"EXCLUÍDO"`, ou `""` (vazio)
2. **status** deve ser: `"Concorrência"`, `"Aprovado"`, ou `"Produção"`
3. **phase** deve ser: `"concorrencia"` ou `"producao"`
4. **honorariumPercentage** deve ser: 10, 15 ou 20
5. **total** deve ser recalculado no backend: `quantity * days * unitPrice`
6. **totalValue** do budget deve ser recalculado: soma de todos `items.total`
7. Não permitir edição de budgets com `isLocked = true`
8. Aprovação: validar unicidade por fase dentro do mesmo Job

### Tratamento de Erros

O frontend espera mensagens de erro em português. Erros conhecidos:

- `"Orçamento não encontrado."`
- `"Este orçamento já está aprovado e bloqueado."`
- `"Já existe um orçamento aprovado na Concorrência deste Job. Apenas 1 é permitido."`
- `"Já existe um orçamento com Produção Aprovada neste Job. Apenas 1 é permitido."`

---

## 13. Tema de Cores

```css
--color-brand-primary: #000000 --color-brand-accent: #666666;
```

Design minimalista em preto/cinza. Sem cores vibrantes de marca.

---

## 14. Documentação Existente (`docs/`)

O projeto já contém documentos de referência na pasta `docs/`:

### 14.1 `docs/regras-backend.md` - Regras para Backend

Define o fluxo alvo (que pode diferir do frontend atual):

**Nomenclatura alvo para backend:**

- `Client` -> `Company` (Empresa)
- `Job` -> `Event` (Evento)
- `Budget` -> `Budget` (Orçamento)

**Status no backend (difere do frontend atual):**

- `Rascunho` | `Em andamento` | `Aprovado` (vs. `Concorrência` | `Aprovado` | `Produção` no frontend)

**Endpoints sugeridos (fluxo Empresa -> Evento -> Orçamento):**

```
GET    /companies
POST   /companies
GET    /companies/:companyId
PUT    /companies/:companyId
DELETE /companies/:companyId          (cascata: eventos + orçamentos)

GET    /events?companyId=:companyId
POST   /events
GET    /events/:eventId
PUT    /events/:eventId
DELETE /events/:eventId               (cascata: orçamentos)

GET    /budgets?eventId=:eventId
POST   /budgets                       (recebendo eventId)
GET    /budgets/:id
PUT    /budgets/:id
DELETE /budgets/:id
POST   /budgets/:id/duplicate
```

**Validações recomendadas para API:**

1. Validar enums: `status`, `billingType`, `honorariumPercentage`
2. Campos monetários e quantitativos devem ser numéricos (>= 0, salvo ajustes)
3. Evento só pode ser criado para `companyId` existente
4. Orçamento só pode ser criado para `eventId` existente
5. **Recalcular valores sensíveis no backend (não confiar no frontend):** `item.total`, subtotais, impostos, `totalValue`
6. Persistir timestamp de atualização no servidor
7. **Recomendado:** Retornar no payload tanto os itens quanto um bloco de resumo calculado (subtotais, impostos, pendências e cronograma)

### 14.2 `docs/regras-orcamento.md` - Regras Financeiras

Detalha as regras de cálculo na ordem correta:

**Valor Total do Orçamento (fórmula oficial):**

```
Valor Total = FATURAMENTO FORNECEDORES GERAL + Subtotal 2 + IMPOSTO NF SERVIÇOS JOY
```

Onde:

```
FATURAMENTO FORNECEDORES GERAL = Sub1 via CLIENTE + Sub1 via JOY + IMPOSTO NF JOY EVENTOS
Subtotal 2 = Serviços internos + Planejamento + Honorários + Taxas administrativas
IMPOSTO NF SERVIÇOS JOY = Subtotal 2 * 18%
```

> **IMPORTANTE:** O total do orçamento NÃO é uma soma bruta simples de `item.total`. Ele segue a fórmula de composição acima, que inclui impostos calculados e honorários.

**Cronograma de pagamento no backend:**

- Frontend atual usa 6 colunas (inclui `payment120d`)
- O doc `regras-orcamento.md` menciona apenas 5 (até 90 dias)
- **Alinhar com o cliente qual é o correto**

**Regras de pendência de faturamento:**

- Se `item.total > 0` e `billingType` vazio: marcar como pendência
- Não considerar como subtotal de fornecedores

### 14.3 `docs/identidade-visual.md` - Design System

- Cores: apenas preto, branco e tons de cinza
- Logo Joy sempre em versão PB
- Nome da aplicação: **Sistema Joy**
- Botões primários: fundo preto/cinza escuro com texto branco
- Cards: fundo branco, bordas `gray-200`, sombras leves

---

## 15. Divergências Frontend vs. Documentação Backend

| Aspecto                 | Frontend Atual                                                    | Doc Backend (`regras-backend.md`)      |
| ----------------------- | ----------------------------------------------------------------- | -------------------------------------- |
| Entidade pai            | `Client`                                                          | `Company` (Empresa)                    |
| Entidade meio           | `Job`                                                             | `Event` (Evento)                       |
| FK do orçamento         | `jobId`                                                           | `eventId`                              |
| Status                  | `Concorrência`, `Aprovado`, `Produção`                            | `Rascunho`, `Em andamento`, `Aprovado` |
| Phase                   | `concorrencia`, `producao`                                        | Não mencionado                         |
| Aprovação               | Cria cópia aprovada + cópia produção                              | Não detalhado                          |
| `isLocked`              | Sim                                                               | Não mencionado                         |
| `payment120d`           | Sim (6 colunas)                                                   | Não (5 colunas, até 90d)               |
| Campos de rentabilidade | `fornecedorName`, `fornecedorValue`, `percentBV`, `percentNfOver` | Não mencionados                        |

> **Recomendação:** Decidir qual nomenclatura e fluxo seguir. O frontend pode ser ajustado para acompanhar o backend se necessário.

---

## 16. Resumo do Fluxo de Uso

1. **Login:** Usuário informa nome e email
2. **Dashboard:** Visualiza lista de Clientes -> seleciona um -> vê Jobs -> seleciona um -> vê Orçamentos (em abas: Concorrência, Aprovados, Produção)
3. **Criar Orçamento:** A partir de um Job, cria novo orçamento com itens padrão
4. **Editar Orçamento:** Planilha estilo Excel (AG Grid) com todas as colunas de BudgetItem
5. **Painel Lateral:** Mostra resumo de faturamento, cronograma de pagamento e serviços internos
6. **Sidebar de Rentabilidade:** Análise de BV/Over por fornecedor
7. **Duplicar:** Cria cópia com versão incrementada
8. **Aprovar:** Cria snapshot aprovado (bloqueado) + opcionalmente cria cópia para produção
9. **Produção:** Orçamento na fase de produção, editável, com valores reais dos fornecedores
