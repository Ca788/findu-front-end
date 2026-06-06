import { AuthCard } from '@/features/auth/components/AuthCard';
import { ResetPasswordForm } from '@/features/auth/components/resetPassword/ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <AuthCard
      eyebrow="FindU"
      title="Definir nova senha"
      description="Escolha uma nova senha para sua conta."
    >
      <ResetPasswordForm token={token ?? ''} />
    </AuthCard>
  );
}
