'use client';

import { AccountBalanceCard } from '@/features/statements/components/AccountBalanceCard';
import type { Statement } from '@/features/statements/models/statement.model';

interface StatementKpisProps {
  statement?: Statement;
}

export function StatementKpis({ statement }: StatementKpisProps) {
  return <AccountBalanceCard statement={statement} />;
}
