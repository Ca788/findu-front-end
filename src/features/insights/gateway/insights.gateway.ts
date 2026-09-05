import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { PaginatedSuccessResponse } from '@/infrastructure/AppResponse';
import type { PaginationQueryParams } from '@/infrastructure/api-query-params';
import type {
  Insight,
  InsightListFilters,
} from '@/features/insights/models/insight.model';

const BASE_PATH = '/intelligence/insights';

export interface ListInsightsParams extends InsightListFilters, PaginationQueryParams {}

export async function listInsights(
  params?: ListInsightsParams,
): Promise<PaginatedSuccessResponse<Insight>> {
  const response = await authorizedApiClient.get<PaginatedSuccessResponse<Insight>>(
    BASE_PATH,
    {
      params: {
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 10,
        view: params?.view ?? 'default',
        reference_type: params?.reference_type,
        severity: params?.severity,
        period: params?.period,
      },
    },
  );
  return response.data;
}
