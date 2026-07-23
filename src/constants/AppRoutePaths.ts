export class AppRoutePaths {
  static readonly ROOT = '/';
  static readonly HOME = '/home';
  static readonly LOGIN = '/login';
  static readonly REGISTER = '/register';
  static readonly FORGOT_PASSWORD = '/forgot-password';
  static readonly RESET_PASSWORD = '/reset-password';
  static readonly DASHBOARD = '/dashboard';
  static readonly CATEGORIES = '/categories';
  static readonly STATEMENTS = '/statements';
  static readonly STATEMENTS_DETAIL = '/statements/detail';
  static readonly RECURRENCES = '/recurrences';
  static readonly INSTALLMENTS = '/installments';
  static readonly BUDGETS = '/budgets';
  static readonly CHAT = '/chat';
  static readonly CHAT_CONVERSATION = '/chat/c';
  static readonly PROFILE = '/profile';
  static readonly TODOS = '/todos';

  static statementDetail(month: string): string {
    return `${this.STATEMENTS_DETAIL}?month=${encodeURIComponent(month)}`;
  }

  static chatConversation(id: string): string {
    return `${this.CHAT_CONVERSATION}?id=${encodeURIComponent(id)}`;
  }
}
