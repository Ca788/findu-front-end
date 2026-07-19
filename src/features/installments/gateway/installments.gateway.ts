import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  InstallmentPlan,
  InstallmentPlanInput,
  InstallmentPlanUpdateInput,
} from '@/features/installments/models/installment.model';

const BASE_PATH = '/financial/installment_plans';

export interface ListInstallmentPlansParams {
  page?: number;
  perPage?: number;
}

export async function listInstallmentPlans(
  params?: ListInstallmentPlansParams,
): Promise<PaginatedSuccessResponse<InstallmentPlan>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<InstallmentPlan>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 20,
    },
  });
  return response.data;
}

export async function getInstallmentPlan(id: string): Promise<InstallmentPlan> {
  const response = await authorizedApiClient.get<SuccessResponse<InstallmentPlan>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createInstallmentPlan(
  input: InstallmentPlanInput,
): Promise<InstallmentPlan> {
  const response = await authorizedApiClient.post<SuccessResponse<InstallmentPlan>>(
    BASE_PATH,
    { installment_plan: input },
  );
  return response.data.data;
}

export async function updateInstallmentPlan(
  id: string,
  input: InstallmentPlanUpdateInput,
): Promise<InstallmentPlan> {
  const response = await authorizedApiClient.patch<SuccessResponse<InstallmentPlan>>(
    `${BASE_PATH}/${id}`,
    { installment_plan: input },
  );
  return response.data.data;
}

export async function cancelInstallmentPlan(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
