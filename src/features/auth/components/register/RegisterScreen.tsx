import { AuthFormShell } from '@/features/auth/components/AuthFormShell';
import { RegisterForm } from '@/features/auth/components/register/RegisterForm';

export function RegisterScreen() {
  return (
    <AuthFormShell
      title="Criar conta"
      description="Comece a organizar suas finanças em segundos."
    >
      <RegisterForm />
    </AuthFormShell>
  );
}
