import { Paging } from "@/types/pagination";


export declare interface CreateGamematch {
  companyId: string;
  gameId: string;
  matchName: string;
  leftPoint: number;
  rightPoint: number;
  isRubber: boolean;
  gameMatchTeams: {
      name: string;
      gameMatchTeamPlayers: {
          playerId: string;
      }[];
  }[];
  gameMatchScores: {
      leftScore: number;
      rightScore: number;
  }[];
  ball: number;
}