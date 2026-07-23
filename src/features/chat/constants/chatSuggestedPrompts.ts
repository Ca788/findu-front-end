export interface ChatSuggestedPrompt {
  id: string;
  label: string;
  message: string;
}

export const CHAT_SUGGESTED_PROMPTS: ChatSuggestedPrompt[] = [
  {
    id: 'month-status',
    label: 'Como está meu mês?',
    message: 'Como está meu mês financeiro até agora? Resuma saldo, entradas e saídas.',
  },
  {
    id: 'cut-expenses',
    label: 'Onde posso cortar?',
    message: 'Onde posso cortar gastos neste mês com base no meu extrato e categorias?',
  },
  {
    id: 'save-1000',
    label: 'Plano para sobrar R$ 1.000',
    message:
      'Quero sobrar R$ 1.000 por mês. Monte um plano prático em 4 semanas com base na minha realidade.',
  },
  {
    id: 'installments-end',
    label: 'Quando as parcelas acabam?',
    message: 'Quais dos meus parcelamentos estão perto do fim e quando cada um termina?',
  },
  {
    id: 'emergency-fund',
    label: 'Reserva de emergência',
    message:
      'Como montar minha reserva de emergência? Sugira um valor-alvo e um plano de aportes.',
  },
  {
    id: 'subscriptions',
    label: 'Assinaturas pesadas',
    message:
      'Quais assinaturas ou gastos recorrentes estão pesando no meu orçamento? O que vale revisar?',
  },
];
