import type { InstallmentPlan } from '@/features/installments/models/installment.model';

export const ENDING_INSTALLMENT_THRESHOLD = 2;

export function isEndingInstallment(
  plan: InstallmentPlan,
  threshold = ENDING_INSTALLMENT_THRESHOLD,
): boolean {
  return (
    plan.status === 'active' &&
    plan.remaining_count > 0 &&
    plan.remaining_count <= threshold
  );
}

export function endingInstallmentMessage(plan: InstallmentPlan): string {
  const name = plan.description?.trim() || 'seu parcelamento';
  const remaining = plan.remaining_count;

  if (remaining === 1) {
    return `Falta apenas 1 parcela de ${name}.`;
  }

  return `Faltam apenas ${remaining} parcelas de ${name}.`;
}

export function selectEndingInstallments(
  plans: InstallmentPlan[],
  threshold = ENDING_INSTALLMENT_THRESHOLD,
): InstallmentPlan[] {
  return plans
    .filter((plan) => isEndingInstallment(plan, threshold))
    .sort((a, b) => a.remaining_count - b.remaining_count);
}
