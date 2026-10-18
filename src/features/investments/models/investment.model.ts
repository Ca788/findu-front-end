export type InvestmentAssetType =
  | 'fixed_income'
  | 'stocks'
  | 'funds'
  | 'treasury'
  | 'crypto'
  | 'other';

export type InvestmentStatus = 'active' | 'redeemed';

export interface Investment {
  id: string;
  name: string;
  asset_type: InvestmentAssetType;
  institution?: string | null;
  invested_amount: string;
  current_amount: string;
  invested_on: string;
  status: InvestmentStatus;
  return_amount?: string | number;
  return_percent?: number;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface InvestmentInput {
  name: string;
  asset_type: InvestmentAssetType;
  institution?: string;
  invested_amount: number;
  current_amount?: number;
  invested_on: string;
  status?: InvestmentStatus;
  notes?: string;
}

export const INVESTMENT_ASSET_LABELS: Record<InvestmentAssetType, string> = {
  fixed_income: 'Renda fixa',
  stocks: 'Ações',
  funds: 'Fundos',
  treasury: 'Tesouro',
  crypto: 'Cripto',
  other: 'Outro',
};

export const INVESTMENT_STATUS_LABELS: Record<InvestmentStatus, string> = {
  active: 'Ativo',
  redeemed: 'Resgatado',
};
