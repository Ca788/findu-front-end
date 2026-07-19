import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  RecurrenceRule,
  RecurrenceRuleInput,
} from '@/features/recurrences/models/recurrence.model';

const BASE_PATH = '/financial/recurrence_rules';

export interface ListRecurrencesParams {
  page?: number;
  perPage?: number;
}

export async function listRecurrences(
  params?: ListRecurrencesParams,
): Promise<PaginatedSuccessResponse<RecurrenceRule>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<RecurrenceRule>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 20,
    },
  });
  return response.data;
}

export async function getRecurrence(id: string): Promise<RecurrenceRule> {
  const response = await authorizedApiClient.get<SuccessResponse<RecurrenceRule>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createRecurrence(
  input: RecurrenceRuleInput,
): Promise<RecurrenceRule> {
  const response = await authorizedApiClient.post<SuccessResponse<RecurrenceRule>>(
    BASE_PATH,
    { recurrence_rule: input },
  );
  return response.data.data;
}

export async function updateRecurrence(
  id: string,
  input: RecurrenceRuleInput,
): Promise<RecurrenceRule> {
  const response = await authorizedApiClient.patch<SuccessResponse<RecurrenceRule>>(
    `${BASE_PATH}/${id}`,
    { recurrence_rule: input },
  );
  return response.data.data;
}

export async function cancelRecurrence(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
