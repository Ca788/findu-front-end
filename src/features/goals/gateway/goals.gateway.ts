import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { Goal, GoalStatus } from '@/features/goals/models/goal.model';

const BASE_PATH = '/financial/goals';

export interface ListGoalsParams {
  page?: number;
  perPage?: number;
  status?: GoalStatus;
  category_id?: string;
}

export async function listGoals(
  params?: ListGoalsParams,
): Promise<PaginatedSuccessResponse<Goal>> {
  const response = await authorizedApiClient.get<PaginatedSuccessResponse<Goal>>(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      status: params?.status,
      category_id: params?.category_id,
    },
  });
  return response.data;
}
