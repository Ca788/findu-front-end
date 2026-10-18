import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  Investment,
  InvestmentAssetType,
  InvestmentInput,
  InvestmentStatus,
} from '@/features/investments/models/investment.model';

const BASE_PATH = '/financial/investments';

export interface ListInvestmentsParams {
  page?: number;
  perPage?: number;
  status?: InvestmentStatus;
  asset_type?: InvestmentAssetType;
}

export async function listInvestments(
  params?: ListInvestmentsParams,
): Promise<PaginatedSuccessResponse<Investment>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<Investment>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 20,
      status: params?.status,
      asset_type: params?.asset_type,
    },
  });
  return response.data;
}

export async function createInvestment(
  input: InvestmentInput,
): Promise<Investment> {
  const response = await authorizedApiClient.post<SuccessResponse<Investment>>(
    BASE_PATH,
    { investment: input },
  );
  return response.data.data;
}

export async function updateInvestment(
  id: string,
  input: InvestmentInput,
): Promise<Investment> {
  const response = await authorizedApiClient.patch<SuccessResponse<Investment>>(
    `${BASE_PATH}/${id}`,
    { investment: input },
  );
  return response.data.data;
}

export async function deleteInvestment(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
