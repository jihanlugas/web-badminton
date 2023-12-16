import { Paging } from "@/types/pagination";

export declare interface GameplayerView {
  id: string;
  gameId: string;
  playerId: string;
  normalGame: number;
  rubberGame: number;
  ball: number;
  isPay: boolean;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  gameName: string;
  playerName: string;
  createName: string;
  updateName: string;
  deleteName: string;
}

export declare interface CreateGameplayer {
  gameId: string;
  playerId: string;
}

export declare interface CreateBulkGameplayer {
  gameId: string;
  listPlayerId: string[];
}

export declare interface UpdateGameplayer {
  gameId: string;
  playerId: string;
  normalGame: number;
  rubberGame: number;
  ball: number;
  isPay: boolean;
}

export declare interface PageGameplayer extends Paging {
  gameId: string;
  playerId: string;
  gameName: string;
  playerName: string;
}