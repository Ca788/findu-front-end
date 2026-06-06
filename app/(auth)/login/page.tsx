import { AuthCard } from '@/features/auth/components/AuthCard';
import { LoginForm } from '@/features/auth/components/login/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="FindU"
      title="Entrar"
      description="Acesse sua conta para continuar."
    >
      <LoginForm />
    </AuthCard>
  );
}
