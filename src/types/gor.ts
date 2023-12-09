import { Paging } from "@/types/pagination";

export declare interface GorView {
  id: string;
  companyId: string;
  name: string;
  description: string;
  address: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
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

export declare interface CreateGor {
  companyId: string;
  name: string;
  description: string;
  address: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
}

export declare interface UpdateGor {
  companyId: string;
  name: string;
  description: string;
  address: string;
  normalGamePrice: number;
  rubberGamePrice: number;
  ballPrice: number;
}

export declare interface PageGor extends Paging{
  companyId: string;
  name: string;
  description: string;
  address: string;
  createName: string;
}