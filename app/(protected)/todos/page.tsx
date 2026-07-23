import { PageContent } from '@/components/layout/PageContent';
import { TodosPage } from '@/features/todos/components/TodosPage';

export default function Page() {
  return (
    <PageContent maxWidth="sm">
      <TodosPage />
    </PageContent>
  );
}
