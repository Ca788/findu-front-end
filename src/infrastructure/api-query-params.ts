export interface PaginationQueryParams {
  page?: number;
  perPage?: number;
  filters?: Record<string, string>;
  sorting?: Record<string, string>;
}
