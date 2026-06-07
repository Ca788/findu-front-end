import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type { PaginationQueryParams } from '@/infrastructure/api-query-params';
import type {
  Category,
  CategoryInput,
} from '@/features/categories/models/category.model';

const BASE_PATH = '/financial/categories';

export async function listCategories(
  params?: PaginationQueryParams,
): Promise<PaginatedSuccessResponse<Category>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<Category>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
    },
  });
  return response.data;
}

export async function getCategory(id: string): Promise<Category> {
  const response = await authorizedApiClient.get<SuccessResponse<Category>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const response = await authorizedApiClient.post<SuccessResponse<Category>>(
    BASE_PATH,
    { category: input },
  );
  return response.data.data;
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<Category> {
  const response = await authorizedApiClient.patch<SuccessResponse<Category>>(
    `${BASE_PATH}/${id}`,
    { category: input },
  );
  return response.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
