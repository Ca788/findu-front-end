import { keepPreviousData } from '@tanstack/react-query';
import { useAppQuery } from '@/hooks/useAppQuery';
import { getStatement } from '@/features/statements/gateway/statements.gateway';
import type { Statement } from '@/features/statements/models/statement.model';

export const STATEMENT_KEY = 'statements:detail';

export function useStatement(month: string) {
  return useAppQuery<Statement>({
    queryKey: [STATEMENT_KEY, month],
    queryFn: () => getStatement(month),
    enabled: !!month,
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
