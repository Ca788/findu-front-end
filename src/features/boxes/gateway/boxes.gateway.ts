import authorizedApiClient from '@/infrastructure/authorized-api.client';
import type {
  PaginatedSuccessResponse,
  SuccessResponse,
} from '@/infrastructure/AppResponse';
import type {
  Box,
  BoxInput,
  BoxKind,
  BoxMoveResult,
  BoxMovement,
  BoxMovementInput,
} from '@/features/boxes/models/box.model';

const BASE_PATH = '/financial/boxes';

export interface ListBoxesParams {
  page?: number;
  perPage?: number;
  kind?: BoxKind;
  archived?: boolean;
}

export interface ListBoxMovementsParams {
  page?: number;
  perPage?: number;
}

export async function listBoxes(
  params?: ListBoxesParams,
): Promise<PaginatedSuccessResponse<Box>> {
  const response = await authorizedApiClient.get<PaginatedSuccessResponse<Box>>(
    BASE_PATH,
    {
      params: {
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 24,
        kind: params?.kind,
        archived: params?.archived ? 'true' : undefined,
      },
    },
  );
  return response.data;
}

export async function getBox(id: string): Promise<Box> {
  const response = await authorizedApiClient.get<SuccessResponse<Box>>(
    `${BASE_PATH}/${id}`,
    { params: { view: 'extended' } },
  );
  return response.data.data;
}

export async function createBox(input: BoxInput): Promise<Box> {
  const response = await authorizedApiClient.post<SuccessResponse<Box>>(
    BASE_PATH,
    { box: input },
  );
  return response.data.data;
}

export async function updateBox(id: string, input: BoxInput): Promise<Box> {
  const response = await authorizedApiClient.patch<SuccessResponse<Box>>(
    `${BASE_PATH}/${id}`,
    { box: input },
  );
  return response.data.data;
}

export async function archiveBox(id: string, restore = false): Promise<Box> {
  const response = await authorizedApiClient.post<SuccessResponse<Box>>(
    `${BASE_PATH}/${id}/archive`,
    restore ? { restore: true } : {},
  );
  return response.data.data;
}

export async function moveBoxFunds(
  id: string,
  input: BoxMovementInput,
): Promise<BoxMoveResult> {
  const response = await authorizedApiClient.post<SuccessResponse<BoxMoveResult>>(
    `${BASE_PATH}/${id}/move`,
    { movement: input },
  );
  return response.data.data;
}

export async function listBoxMovements(
  id: string,
  params?: ListBoxMovementsParams,
): Promise<PaginatedSuccessResponse<BoxMovement>> {
  const response = await authorizedApiClient.get<
    PaginatedSuccessResponse<BoxMovement>
  >(`${BASE_PATH}/${id}/movements`, {
    params: {
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
    },
  });
  return response.data;
}
