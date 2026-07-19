# Front-end Architecture Spec

> Especificação **abstrata** e **agnóstica de stack** da arquitetura padrão
> usada nos projetos front-end. Serve como contrato de organização,
> nomenclatura e responsabilidades — independente do framework
> (Next/React/Vue/Svelte/SolidJS/etc.), do cliente HTTP (Axios/Fetch/Ky) ou
> da lib de estado (Redux/Zustand/Pinia/Signals).
>
> Princípio-mestre: **Clean Architecture orientada a features**.
> Dependências apontam **sempre** das camadas externas para as internas.
> O domínio nunca conhece o transporte; a UI nunca conhece a infraestrutura.

---

## 1. Princípios fundamentais

1. **Feature-first**: o código se organiza por domínio de negócio, não por
   tipo técnico. Tudo o que pertence a uma feature mora dentro dela.
2. **Camadas isoladas e unidirecionais**: cada camada tem uma única
   responsabilidade e só pode depender das camadas listadas como permitidas.
3. **Inversão de detalhes**: detalhes (HTTP, storage, framework, UI lib)
   ficam em `infrastructure/`. O domínio depende de abstrações, não de libs.
4. **Modelos como contrato**: toda feature define seus próprios modelos
   (entidades, inputs, filtros). Nenhum componente conversa com a API por
   tipos vindos do transporte.
5. **Gateways concentram I/O**: nenhuma chamada de rede vive em hook ou
   componente. Apenas em `gateway/`.
6. **Hooks orquestram, não decidem**: hooks combinam gateway + cache +
   estado e expõem uma API ergonômica para a UI.
7. **Componentes burros por padrão**: UI recebe dados via props/hooks e
   delega comportamento. Sem regras de negócio em JSX.
8. **Estado global é exceção**: usado só para preocupações cross-cutting
   (auth, tema, sessão). Estado de servidor mora no cache da camada de
   dados. Estado de UI mora no componente ou em `contexts/`.
9. **Stack-agnostic**: nenhuma camada interna importa diretamente o
   framework. Adapters ficam em `infrastructure/` ou `providers/`.

---

## 2. Regra de dependência (direção das setas)

```
                       app/ (routing)
                            │
                            ▼
                       providers/ ──▶ infrastructure/
                            │              ▲
                            ▼              │
                        guards/            │
                            │              │
                            ▼              │
   components/layout/ ◀── features/* ──────┤
                            │              │
                            ├─▶ hooks/     │
                            ├─▶ store/ ────┤
                            ├─▶ contexts/ ─┤
                            │              │
                            ▼              │
                       gateway/ ───────────┘
                            │
                            ▼
                         models/
```

Regras:

- `models/` **não importa nada** além de outros models.
- `gateway/` importa apenas `models/` e `infrastructure/`.
- `hooks/` (da feature) importa `gateway/`, `models/`, `store/` e
  `infrastructure/`. **Não importa componentes.**
- `components/` (da feature) importa apenas `hooks/`, `models/` e
  `components/common`. **Não importa gateway diretamente.**
- `app/` (routing) importa apenas `features/*/components` e
  `components/layout`.
- `providers/`, `guards/` e `infrastructure/` são leaf nodes técnicos.

Violar a direção das setas é o sintoma número um de erosão arquitetural.

---

## 3. Estrutura de pastas (canônica)

```
app/                          # entrypoint de rotas (framework-specific)
  (public)/                   # rotas públicas
  (protected)/                # rotas autenticadas
src/
  components/
    common/                   # UI reutilizável, sem regra de negócio
    layout/                   # shell, sidebar, topbar, page containers
  constants/                  # enums/strings/paths globais
  contexts/                   # contextos React/UI compartilhados (não-globais)
  features/
    <feature>/
      components/             # UI da feature
      hooks/                  # orquestração (queries/mutations/seletores)
      gateway/                # I/O (HTTP, websockets, files)
      models/                 # entidades, inputs, filtros, enums
  guards/                     # gates de acesso (auth, role, feature-flag)
  hooks/                      # hooks técnicos compartilhados (useAppQuery, useDevice)
  infrastructure/             # clientes técnicos (api, cable, storage, telemetry)
    storage/                  # camada de persistência local
  lib/                        # adapters de terceiros encapsulados
  models/                     # modelos cross-feature (ex.: User)
  providers/                  # composição de providers globais
  store/                      # estado global (slices), opcional
    slices/
  theme/                      # design tokens / theming
  utils/                      # funções puras
```

> Pastas vazias são aceitáveis quando previstas no spec; servem como ponto
> óbvio de extensão futura.

---

## 4. Camadas em detalhe

### 4.1. `models/` (Domain)

- Define **entidades**, **inputs** (DTOs de escrita) e **filtros** (DTOs de
  consulta) da feature.
- Tipos puros. Zero dependência de framework, transporte ou storage.
- Quando uma entidade for usada por múltiplas features, sobe para
  `src/models/`.

Exemplo abstrato:

```ts
export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: string;
  transaction_type: TransactionType;
  occurred_at?: string | null;
  category_id?: string | null;
}

export interface TransactionInput {
  amount: number;
  transaction_type: TransactionType;
  occurred_at?: string | null;
}

export interface TransactionListFilters {
  transaction_type?: TransactionType;
  from?: string;
  to?: string;
}
```

### 4.2. `gateway/` (Data Access)

- Única camada autorizada a falar com a rede / WebSocket / arquivos.
- Recebe `models` / inputs e retorna `models` ou `Response<Model>`.
- **Nunca** retorna o objeto bruto do transporte (ex.: `AxiosResponse`).
- Encapsula paginação, headers, multipart, query params.
- Cada gateway expõe **funções puras assíncronas**, não classes com estado.
- Nome do arquivo: `<feature>.gateway.ts`.

Contrato mínimo:

```ts
list<F>(filters: F & Pagination): Promise<PaginatedResponse<Entity>>
get(id: ID): Promise<Entity>
create(input: Input): Promise<Entity>
update(id: ID, input: Input): Promise<Entity>
remove(id: ID): Promise<void>
```

### 4.3. `infrastructure/`

- Clientes técnicos compartilhados: `authorizedApiClient`,
  `publicApiClient`, `cableClient`, telemetria, file uploader, etc.
- Define o **contrato de resposta padrão** da aplicação
  (`SuccessResponse<T>`, `PaginatedSuccessResponse<T>`, `ErrorResponse`,
  `AppErrorResultMapper`).
- `storage/` expõe uma interface `AppStorage` (`get/set/remove/clear`) e
  implementações trocáveis (memória, local, cookie). A escolha é feita por
  um `StorageBuilder` agregador.
- Faz interceptação transversal: injeção de token, refresh, 401 →
  logout/redirect, normalização de erros.

### 4.4. `hooks/` (por feature)

- Combinam gateway + cache de servidor + store + side-effects.
- Padrões nomeados:
  - `use<Entity>s(filters)` → query de lista
  - `use<Entity>(id)` → query de item
  - `useCreate<Entity>()` → mutação create
  - `useUpdate<Entity>()` → mutação update
  - `useDelete<Entity>()` → mutação delete
  - `use<Entity>Filters()` → estado de filtros (URL/local)
  - `use<Entity>Dialogs()` → orquestração de modais da feature
- **Invalidam cache** após mutações usando chaves estáveis exportadas
  (`<FEATURE>_LIST_KEY`).
- Não importam componentes. Não tocam no DOM.

### 4.5. `components/` (da feature)

- Subpastas por intenção: `list/`, `form/`, `filters/`, `delete/`, `detail/`.
- Cada componente:
  - Lê dados via hooks da própria feature.
  - Recebe callbacks/IDs via props.
  - Não chama gateway diretamente.
  - Reaproveita `components/common/` para padrões transversais
    (ConfirmDialog, FormDialog, DataPagination, PageHeader, RowActions).
- Página da feature (`<Feature>Page.tsx`) é o componente raiz consumido
  pelo `app/`.

### 4.6. `components/common/` e `components/layout/`

- `common/`: blocos de UI reutilizáveis e **sem domínio** (diálogos,
  paginação, headers, avatares, botões compostos).
- `layout/`: shell da aplicação (sidebar, topbar, containers de página,
  shells protegidos/públicos). Aqui mora a estrutura visual macro.

### 4.7. `app/` (Routing)

- Camada de entrada do framework de rotas.
- Cada rota é um arquivo curto que apenas:
  1. Aplica o layout/guard apropriado.
  2. Renderiza o componente-página da feature.
- Não contém lógica nem chamadas a gateways/hooks de dados.

Exemplo:

```tsx
export default function Page() {
  return (
    <PageContent>
      <TransactionsPage />
    </PageContent>
  );
}
```

### 4.8. `guards/`

- Componentes/HOFs que **bloqueiam renderização** com base em condições
  (autenticado, role, feature-flag, onboarding completo).
- Consomem `hooks/` ou `store/`, nunca o gateway diretamente.
- Devem retornar um estado de loading determinístico (skeleton/spinner) e
  redirecionar quando negado.

### 4.9. `providers/`

- Compõem todos os providers globais em um único `AppProviders`.
- Ordem de aninhamento importa e deve ser estável:
  `Store → ServerCache → UI/Theme → Notifications → Bootstrap → children`.
- `*Bootstrap` é um componente sem UI que dispara efeitos de inicialização
  (ex.: hidratar sessão a partir do token).

### 4.10. `store/` (Global state)

- Usado **apenas** para estado verdadeiramente global: sessão/auth, tema,
  feature-flags do usuário. Não usar para listas, filtros ou dados de
  servidor.
- Cada slice expõe:
  - `initialState`, `reducer`, `actions/thunks`, `select<X>`.
- Thunks chamam **gateways** e mapeiam erros via `AppErrorResultMapper`.
- Nada de side-effects de UI dentro de slices.

### 4.11. `contexts/`

- Estado de UI compartilhado entre componentes irmãos, mas não global
  (ex.: sidebar aberta, agente flutuante).
- Pequenos, com API explícita (`use<Context>()`), sem regras de negócio.

### 4.12. `hooks/` (compartilhado, na raiz)

- Hooks técnicos, sem domínio: `useAppQuery`, `useDevice`,
  `usePageTitle`, `usePersistedBoolean`.
- São thin wrappers sobre libs externas para **padronizar uso** e permitir
  troca futura sem tocar features.

### 4.13. `theme/`, `constants/`, `utils/`, `lib/`

- `theme/`: tokens, paletas, configuração de design system.
- `constants/`: rotas (`AppRoutePaths`), chaves de storage
  (`AppStorageKeys`), enums de UI globais.
- `utils/`: funções puras (formatadores, validadores, helpers).
- `lib/`: adapters explícitos de bibliotecas externas. Tudo que for libs
  embutidas com customização vive aqui.

---

## 5. Fluxo padrão de uma feature

Caso de uso: **listar e criar transações**.

```
[Page route]
    │ renders
    ▼
[<Feature>Page]
    │ uses
    ▼
[useTransactions(filters)] ──▶ [transactions.gateway.list] ──▶ [authorizedApiClient]
    │                                                              │
    │                                                              ▼
    │                                                       [PaginatedResponse]
    ▼
[<Feature>Table] ──renders──▶ [common/DataPagination, RowActions]

[<Feature>FormDialog]
    │ submits
    ▼
[useCreateTransaction] ──▶ [transactions.gateway.create] ──▶ [API]
    │ onSuccess
    ▼
[queryClient.invalidateQueries(TRANSACTIONS_LIST_KEY)]
```

Regra: cada flecha é **unidirecional** e cada nó tem uma única
responsabilidade.

---

## 6. Contrato de resposta da API

A aplicação trabalha sempre com três formas canônicas:

```ts
SuccessResponse<T>           // { success: true, data: T, message?, metadata? }
PaginatedSuccessResponse<T>  // SuccessResponse<T[]> + pagination + filterOptions?
ErrorResponse                // { success: false, errorCode, message?, error? }
```

- Toda resposta de erro deve passar por `AppErrorResultMapper` para gerar
  um `AppErrorResult` consumível por UI/store.
- Paginação no request: `page`, `perPage`. Defaults: `page=1`, `perPage=10`.
- Filtros sempre tipados em `models` e propagados via gateway.
- Field-selection (quando suportado): incluir array `fields` no request.

---

## 7. Convenções de nomenclatura

- Arquivos: `kebab-case` para utilitários, `PascalCase.tsx` para
  componentes, `<feature>.gateway.ts`, `<entity>.model.ts`,
  `<feature>.slice.ts`.
- Hooks: `use<Coisa>` em `camelCase`.
- Query keys: `<feature>:<intent>` (`'transactions:list'`,
  `'transactions:item'`).
- Storage keys: enum `AppStorageKeys` em `constants/`.
- Rotas: enum `AppRoutePaths` em `constants/`.
- Tipos de DTO: `Input` para escrita, `Filters` para query, sem sufixos
  desnecessários.

---

## 8. Definition of Done por feature

Uma feature só está "pronta" quando:

1. Tem `models/` com entidade + Input + Filters.
2. Tem `gateway/` cobrindo list (com paginação e filtros), get, create,
   update, delete — ou justificativa explícita para subset.
3. Tem hooks de query e mutation; mutations invalidam o cache de lista.
4. Tem `<Feature>Page` consumida por `app/` via componente raiz.
5. Trata loading, empty state e erro mapeado por `AppErrorResultMapper`.
6. Respeita guards de auth/role.
7. Não importa nada fora das camadas permitidas (lint check).
8. UI baseada em `components/common/` quando o padrão já existir.

---

## 9. Anti-padrões a evitar

- ❌ Componente importando `axios`/`fetch` diretamente.
- ❌ Gateway retornando `AxiosResponse` para o hook.
- ❌ Hook de feature importando outro hook de feature diferente — se
  precisar, suba o tipo para `src/models/` e o util para `src/hooks/`.
- ❌ Slice global guardando lista de servidor.
- ❌ Lógica de negócio em `app/page.tsx`.
- ❌ Lógica de auth em mais de um lugar — `guards/AuthGuard` é o único
  ponto de bloqueio de renderização.
- ❌ Estilos/cor hardcoded fora de `theme/`.
- ❌ Strings de rota/storage espalhadas — use enums em `constants/`.

---

## 10. Mapeamento por stack (referência rápida)

| Conceito abstrato | Next/React        | Vue 3 / Nuxt     | SvelteKit         |
| ----------------- | ----------------- | ---------------- | ----------------- |
| Routing layer     | `app/`            | `pages/`         | `src/routes/`     |
| Server cache hook | TanStack Query    | TanStack Query   | TanStack Query    |
| Global store      | Redux Toolkit     | Pinia            | Svelte stores     |
| UI primitives     | MUI/Tailwind      | Naive/Tailwind   | Skeleton/Tailwind |
| HTTP client       | Axios             | Axios/Ofetch     | Fetch wrapper     |
| Realtime          | ActionCable / WS  | ActionCable / WS | ActionCable / WS  |

A escolha da stack **não muda** a estrutura de pastas, os nomes de
camada, nem os contratos. Só muda os adapters em `infrastructure/`,
`providers/` e `app/`.

---

## 11. Checklist de novo projeto

Ao iniciar um novo front-end, criar a árvore vazia com `.gitkeep` em:

- `src/components/{common,layout}`
- `src/constants`
- `src/contexts`
- `src/features` (vazio, populado por feature)
- `src/guards`
- `src/hooks`
- `src/infrastructure/storage`
- `src/lib`
- `src/models`
- `src/providers`
- `src/store/slices`
- `src/theme`
- `src/utils`

E provisionar de imediato:

1. `infrastructure/AppResponse.ts` com os 3 contratos canônicos.
2. `infrastructure/<authorized|public>-api.client.ts`.
3. `infrastructure/storage/StorageBuilder.ts`.
4. `constants/AppStorageKeys.ts` e `constants/AppRoutePaths.ts`.
5. `providers/AppProviders.tsx` com a ordem padrão.
6. `guards/AuthGuard.tsx`.
7. `hooks/useAppQuery.ts` (thin wrapper sobre a lib de cache).
8. `store/slices/auth.slice.ts` + `models/user.model.ts`.
9. `features/auth/` com gateway, hooks e components mínimos
   (login, register, forgot/reset, currentUser).

A partir daí, toda nova feature segue a forma:
`features/<feature>/{models,gateway,hooks,components}`.
