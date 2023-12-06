export interface Game {
  id: string;
  companyId: string;
  gorId: string;
  name: string;
  description: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
  gameDt: string;
  isFinish: boolean;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  companyName: string;
  gorName: string;
  createName: string;
  updateName: string;
  deleteName: string;
}

export interface GameCreate {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
  gameDt: Date | string;
  isFinish: boolean;
}

export interface GameUpdate {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
  gameDt: Date | string;
  isFinish: boolean;
}