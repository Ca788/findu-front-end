export interface ChatSuggestedPrompt {
  id: string;
  label: string;
  hint: string;
  message: string;
}

export const CHAT_SUGGESTED_PROMPTS: ChatSuggestedPrompt[] = [
  {
    id: 'month-status',
    label: 'Como está meu mês?',
    hint: 'Saldo, entradas e saídas',
    message: 'Como está meu mês financeiro até agora? Resuma saldo, entradas e saídas.',
  },
  {
    id: 'cut-expenses',
    label: 'Onde posso cortar?',
    hint: 'Gastos que dá para revisar',
    message: 'Onde posso cortar gastos neste mês com base no meu extrato e categorias?',
  },
  {
    id: 'save-1000',
    label: 'Sobra de R$ 1.000',
    hint: 'Plano prático em 4 semanas',
    message:
      'Quero sobrar R$ 1.000 por mês. Monte um plano prático em 4 semanas com base na minha realidade.',
  },
  {
    id: 'installments-end',
    label: 'Fim das parcelas',
    hint: 'Quando cada uma termina',
    message: 'Quais dos meus parcelamentos estão perto do fim e quando cada um termina?',
  },
  {
    id: 'emergency-fund',
    label: 'Reserva de emergência',
    hint: 'Valor-alvo e aportes',
    message:
      'Como montar minha reserva de emergência? Sugira um valor-alvo e um plano de aportes.',
  },
  {
    id: 'subscriptions',
    label: 'Assinaturas pesadas',
    hint: 'O que vale cancelar',
    message:
      'Quais assinaturas ou gastos recorrentes estão pesando no meu orçamento? O que vale revisar?',
  },
];
