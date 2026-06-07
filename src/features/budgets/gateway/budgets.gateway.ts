import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  Budget,
  BudgetInput,
  BudgetListFilters,
} from '@/features/budgets/models/budget.model';

const BASE_PATH = '/financial/budgets';

export interface ListBudgetsParams extends BudgetListFilters {
  page?: number;
  perPage?: number;
}

export async function listBudgets(
  params?: ListBudgetsParams,
): Promise<PaginatedSuccessResponse<Budget>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<Budget>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      period_type: params?.period_type,
    },
  });
  return response.data;
}

export async function getCurrentBudgets(referenceDate?: string): Promise<Budget[]> {
  const response = await authorizedApiClient.get<SuccessResponse<Budget[]>>(
    `${BASE_PATH}/current`,
    { params: referenceDate ? { date: referenceDate } : undefined },
  );
  return response.data.data;
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const response = await authorizedApiClient.post<SuccessResponse<Budget>>(
    BASE_PATH,
    { budget: input },
  );
  return response.data.data;
}

export async function updateBudget(id: string, input: BudgetInput): Promise<Budget> {
  const response = await authorizedApiClient.patch<SuccessResponse<Budget>>(
    `${BASE_PATH}/${id}`,
    { budget: input },
  );
  return response.data.data;
}

export async function deleteBudget(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
