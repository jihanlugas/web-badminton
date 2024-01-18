import { Paging } from "@/types/pagination";

export declare interface GamematchView {
    id: string;
    companyId: string;
    gameId: string;
    name: string;
    leftTeamId: string;
    rightTeamId: string;
    leftTeamPoint: number;
    rightTeamPoint: number;
    isRubber: boolean;
    createBy: string;
    createDt: string;
    companyName: string;
    gameName: string;
    leftTeamName: string;
    rightTeamName: string;
    createName: string;
}

export declare interface CreateGamematch {
    companyId: string;
    gameId: string;
    matchName: string;
    leftPoint: string | number;
    rightPoint: string | number;
    isRubber: boolean;
    gameMatchTeams: {
        name: string;
        gameMatchTeamPlayers: {
            playerId: string;
        }[];
    }[];
    gameMatchScores: {
        leftScore: string | number;
        rightScore: string | number;
    }[];
    ball: string | number;
}

export declare interface PageGamematch extends Paging {
  companyId: string;
  gameId: string;
  name: string;
}

