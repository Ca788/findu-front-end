import { PageContainer } from '@/components/layout/PageContainer';
import { HeroCard } from '@/components/marketing/HeroCard';
import { HeroActions } from '@/components/marketing/HeroActions';

export default function Home() {
  return (
    <PageContainer>
      <HeroCard
        eyebrow="FindU"
        title="Seu assistente financeiro."
        description="Acompanhe transações, comprovantes e orçamentos com uma interface limpa e direta."
        actions={<HeroActions />}
      />
    </PageContainer>
  );
}
