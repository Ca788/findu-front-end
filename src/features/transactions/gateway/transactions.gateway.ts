import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  Transaction,
  TransactionInput,
  TransactionListFilters,
} from '@/features/transactions/models/transaction.model';

const BASE_PATH = '/financial/transactions';

export interface ListTransactionsParams extends TransactionListFilters {
  page?: number;
  perPage?: number;
}

export async function listTransactions(
  params?: ListTransactionsParams,
): Promise<PaginatedSuccessResponse<Transaction>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<Transaction>
  >(BASE_PATH, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      transaction_type: params?.transaction_type,
      category_id: params?.category_id,
      from: params?.from,
      to: params?.to,
    },
  });
  return response.data;
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await authorizedApiClient.get<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createTransaction(
  input: TransactionInput,
): Promise<Transaction> {
  const response = await authorizedApiClient.post<SuccessResponse<Transaction>>(
    BASE_PATH,
    { transaction: input },
  );
  return response.data.data;
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  const response = await authorizedApiClient.patch<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${id}`,
    { transaction: input },
  );
  return response.data.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${id}`);
}
