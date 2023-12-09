import { Paging } from "@/types/pagination";

export declare interface GameView {
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
  expectedDebit: number;
  debit: number;
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

export declare interface CreateGame {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
  gameDt: Date | string;
}

export declare interface UpdateGame {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
  gameDt: Date | string;
  isFinish: boolean;
  expectedDebit: number;
  debit: number;
}

export declare interface PageGame extends Paging {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
}