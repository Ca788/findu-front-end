import { AuthCard } from '@/features/auth/components/AuthCard';
import { LoginForm } from '@/features/auth/components/login/LoginForm';

export function LoginScreen() {
  return (
    <AuthCard
      eyebrow="Findu"
      title="Entrar"
      description="Acesse sua conta para continuar."
    >
      <LoginForm />
    </AuthCard>
  );
}
