import { AuthFormShell } from '@/features/auth/components/AuthFormShell';
import { ForgotPasswordForm } from '@/features/auth/components/forgotPassword/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell
      title="Recuperar acesso"
      description="Informe seu email para receber instruções de redefinição."
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}
