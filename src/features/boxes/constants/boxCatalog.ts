import type { BoxIllustrationKey, BoxKind } from '@/features/boxes/models/box.model';

export type BoxMotion = 'float' | 'pulse' | 'wiggle' | 'bounce';

export interface BoxIllustration {
  key: BoxIllustrationKey;
  label: string;
  src: string;
  color: string;
  motion: BoxMotion;
  suggestedKind: BoxKind;
}

export const BOX_ILLUSTRATIONS: BoxIllustration[] = [
  { key: 'piggy', label: 'Cofrinho', src: '/boxes/piggy.png', color: '#F28CA6', motion: 'bounce', suggestedKind: 'custom' },
  { key: 'shield', label: 'Escudo', src: '/boxes/shield.png', color: '#3B82F6', motion: 'pulse', suggestedKind: 'emergency' },
  { key: 'house', label: 'Casa', src: '/boxes/house.png', color: '#F97066', motion: 'float', suggestedKind: 'goal' },
  { key: 'plane', label: 'Viagem', src: '/boxes/plane.png', color: '#60A5FA', motion: 'float', suggestedKind: 'goal' },
  { key: 'car', label: 'Carro', src: '/boxes/car.png', color: '#FACC15', motion: 'wiggle', suggestedKind: 'goal' },
  { key: 'gift', label: 'Presente', src: '/boxes/gift.png', color: '#A78BFA', motion: 'bounce', suggestedKind: 'spending' },
  { key: 'heart', label: 'Coração', src: '/boxes/heart.png', color: '#EF4444', motion: 'pulse', suggestedKind: 'spending' },
  { key: 'coins', label: 'Moedas', src: '/boxes/coins.png', color: '#EAB308', motion: 'bounce', suggestedKind: 'recurring_expenses' },
  { key: 'rocket', label: 'Foguete', src: '/boxes/rocket.png', color: '#FB923C', motion: 'float', suggestedKind: 'goal' },
  { key: 'umbrella', label: 'Guarda-chuva', src: '/boxes/umbrella.png', color: '#2DD4BF', motion: 'wiggle', suggestedKind: 'emergency' },
  { key: 'briefcase', label: 'Trabalho', src: '/boxes/briefcase.png', color: '#B45309', motion: 'bounce', suggestedKind: 'recurring_expenses' },
  { key: 'graduation', label: 'Estudos', src: '/boxes/graduation.png', color: '#4F46E5', motion: 'float', suggestedKind: 'goal' },
];

const BY_KEY = new Map(BOX_ILLUSTRATIONS.map((item) => [item.key, item]));

export function getBoxIllustration(key: string | null | undefined): BoxIllustration {
  return BY_KEY.get(key as BoxIllustrationKey) ?? BOX_ILLUSTRATIONS[0];
}
