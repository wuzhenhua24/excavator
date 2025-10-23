export enum TreasureType {
  Star = 'STAR',
  Gem = 'GEM',
  Bone = 'BONE',
  ToyCar = 'TOY_CAR',
  Crown = 'CROWN'
}

export interface DirtPileData {
  id: number;
  treasure: TreasureType | null;
  isDug: boolean;
}
