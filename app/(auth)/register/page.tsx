import { AuthCard } from '@/features/auth/components/AuthCard';
import { RegisterForm } from '@/features/auth/components/register/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="FindU"
      title="Criar conta"
      description="Comece a organizar suas finanças em segundos."
    >
      <RegisterForm />
    </AuthCard>
  );
}
