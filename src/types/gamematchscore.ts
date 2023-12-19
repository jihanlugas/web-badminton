import { Paging } from "@/types/pagination";

export declare interface GamematchscoreView {
    id: string;
    gameId: string;
    gamematchId: string;
    set: number;
    leftTeamScore: number;
    rightTeamScore: number;
    createBy: string;
    createDt: string;
    gameName: string;
    gamematchName: string;
    createName: string;
}