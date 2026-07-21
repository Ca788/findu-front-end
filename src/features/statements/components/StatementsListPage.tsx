'use client';

import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { useStatementsList } from '@/features/statements/hooks/useStatementsList';
import { StatementCard } from '@/features/statements/components/StatementCard';
import { currentMonthParam } from '@/features/statements/utils/month';

export function StatementsListPage() {
  const query = useStatementsList();
  const rows = query.data ?? [];

  const today = currentMonthParam();
  const [past, current, future] = rows.reduce<
    [typeof rows, typeof rows, typeof rows]
  >(
    (acc, row) => {
      if (row.month < today) acc[0].push(row);
      else if (row.month === today) acc[1].push(row);
      else acc[2].push(row);
      return acc;
    },
    [[], [], []],
  );

  return (
    <Stack spacing={2.5}>
      <Stack spacing={0.25}>
        <Typography variant="body2" color="text.secondary">
          Financeiro
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontSize: { xs: '1.65rem', sm: '1.75rem' },
          }}
        >
          Extratos
        </Typography>
      </Stack>

      {query.isError && <Alert severity="error">Erro ao carregar extratos.</Alert>}
      {query.isFetching && <LinearProgress sx={{ height: 3, borderRadius: 999 }} />}

      {current.length > 0 && (
        <Section title="Este mês">
          {current.map((row) => (
            <StatementCard key={row.month} summary={row} />
          ))}
        </Section>
      )}

      {future.length > 0 && (
        <Section title="Próximos">
          {future.map((row) => (
            <StatementCard key={row.month} summary={row} />
          ))}
        </Section>
      )}

      {past.length > 0 && (
        <Section title="Anteriores">
          {[...past].reverse().map((row) => (
            <StatementCard key={row.month} summary={row} />
          ))}
        </Section>
      )}

      {!query.isFetching && rows.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum extrato disponível ainda.
        </Typography>
      )}
    </Stack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: 1 }}
      >
        {title}
      </Typography>
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
