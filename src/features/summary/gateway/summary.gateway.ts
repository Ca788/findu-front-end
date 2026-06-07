import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import type { Summary, SummaryFilters } from '@/features/summary/models/summary.model';

const BASE_PATH = '/financial/summary';

export async function getSummary(filters?: SummaryFilters): Promise<Summary> {
  const response = await authorizedApiClient.get<SuccessResponse<Summary>>(BASE_PATH, {
    params: {
      from: filters?.from,
      to: filters?.to,
      transaction_type: filters?.transaction_type,
      category_id: filters?.category_id,
    },
  });
  return response.data.data;
}
