import { Paging } from "@/types/pagination";

export declare interface PlayerView {
  id: string;
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  isActive: boolean;
  photoId: string;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  companyName: string;
  createName: string;
  updateName: string;
  deleteName: string;
}

export declare interface CreatePlayer {
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  isActive: boolean;
}

export declare interface UpdatePlayer {
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  isActive: boolean;
}

export declare interface PagePlayer extends Paging{
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  createName: string;
  gameId?: string;
}