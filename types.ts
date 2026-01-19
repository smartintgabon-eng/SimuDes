
export enum DieType {
  D4 = 4,
  D6 = 6,
  D8 = 8,
  D10 = 10,
  D12 = 12,
  D20 = 20
}

export type Screen = 'home' | 'game';

export interface AppSettings {
  themeColor: string;
  dieType: DieType;
}

export interface DieProps {
  type: DieType;
  isRolling: boolean;
  result: number;
  color: string;
  textColor: string;
}
