import { AuthCard } from '@/features/auth/components/AuthCard';
import { ForgotPasswordForm } from '@/features/auth/components/forgotPassword/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="FindU"
      title="Recuperar acesso"
      description="Informe seu email para receber instruções de redefinição."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
