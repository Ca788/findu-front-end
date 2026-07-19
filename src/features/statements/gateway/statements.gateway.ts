import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type { SuccessResponse } from '@/infrastructure/AppResponse';
import type {
  Statement,
  StatementListFilters,
  StatementSummary,
} from '@/features/statements/models/statement.model';
import type {
  Transaction,
  TransactionInput,
} from '@/features/transactions/models/transaction.model';

const BASE_PATH = '/financial/statements';

export async function listStatements(
  filters?: StatementListFilters,
): Promise<StatementSummary[]> {
  const response = await authorizedApiClient.get<SuccessResponse<StatementSummary[]>>(
    BASE_PATH,
    { params: { from: filters?.from, to: filters?.to } },
  );
  return response.data.data;
}

export async function getStatement(month: string): Promise<Statement> {
  const response = await authorizedApiClient.get<SuccessResponse<Statement>>(
    `${BASE_PATH}/${month}`,
  );
  return response.data.data;
}

export async function createEntry(
  month: string,
  input: TransactionInput,
): Promise<Transaction> {
  const response = await authorizedApiClient.post<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${month}/entries`,
    { entry: input },
  );
  return response.data.data;
}

export async function updateEntry(
  month: string,
  id: string,
  input: TransactionInput,
): Promise<Transaction> {
  const response = await authorizedApiClient.patch<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${month}/entries/${id}`,
    { entry: input },
  );
  return response.data.data;
}

export async function deleteEntry(month: string, id: string): Promise<void> {
  await authorizedApiClient.delete(`${BASE_PATH}/${month}/entries/${id}`);
}

export async function markEntryPaid(
  month: string,
  id: string,
  paidAt?: string,
): Promise<Transaction> {
  const response = await authorizedApiClient.post<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${month}/entries/${id}/mark_paid`,
    paidAt ? { paid_at: paidAt } : {},
  );
  return response.data.data;
}

export async function markEntryPending(
  month: string,
  id: string,
): Promise<Transaction> {
  const response = await authorizedApiClient.post<SuccessResponse<Transaction>>(
    `${BASE_PATH}/${month}/entries/${id}/mark_pending`,
    {},
  );
  return response.data.data;
}
