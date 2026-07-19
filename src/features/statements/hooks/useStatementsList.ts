import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import { listStatements } from '@/features/statements/gateway/statements.gateway';
import type {
  StatementListFilters,
  StatementSummary,
} from '@/features/statements/models/statement.model';

export const STATEMENTS_LIST_KEY = 'statements:list';

export function useStatementsList(filters: StatementListFilters = {}) {
  return useAppQuery<StatementSummary[]>({
    queryKey: [STATEMENTS_LIST_KEY, filters],
    queryFn: () => listStatements(filters),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
