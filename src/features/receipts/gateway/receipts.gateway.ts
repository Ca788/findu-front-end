import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type { PaginationQueryParams } from '@/infrastructure/api-query-params';
import type {
  Receipt,
  ReceiptInput,
  ReceiptListFilters,
} from '@/features/receipts/models/receipt.model';

const BASE_PATH = '/financial/receipts';

export interface ListReceiptsParams extends ReceiptListFilters, PaginationQueryParams {}

export async function listReceipts(
  params?: ListReceiptsParams,
): Promise<PaginatedSuccessResponse<Receipt>> {
  const response = await authorizedApiClient.get<PaginatedSuccessResponse<Receipt>>(
    BASE_PATH,
    {
      params: {
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 10,
        view: params?.view ?? 'default',
        payer_phone: params?.payer_phone,
        status: params?.status,
      },
    },
  );
  return response.data;
}

export async function getReceipt(id: string): Promise<Receipt> {
  const response = await authorizedApiClient.get<SuccessResponse<Receipt>>(
    `${BASE_PATH}/${id}`,
  );
  return response.data.data;
}

export async function createReceipt(input: ReceiptInput): Promise<Receipt> {
  const response = await authorizedApiClient.post<SuccessResponse<Receipt>>(
    BASE_PATH,
    { receipt: input },
  );
  return response.data.data;
}

export async function deliverReceipt(id: string): Promise<Receipt> {
  const response = await authorizedApiClient.post<SuccessResponse<Receipt>>(
    `${BASE_PATH}/${id}/deliver`,
  );
  return response.data.data;
}

export async function downloadReceipt(id: string, filename: string): Promise<void> {
  const response = await authorizedApiClient.get<Blob>(`${BASE_PATH}/${id}/download`, {
    responseType: 'blob',
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
