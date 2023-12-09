import { Paging } from "@/types/pagination";

export declare interface CompanyView {
  id: string;
  name: string;
  description: string;
  balance: number;
  createBy: string;
  createDt: string;
  updateBy: string;
  updateDt: string;
  deleteBy: string;
  deleteDt?: string;
  createName: string;
  updateName: string;
  deleteName: string;
  totalGor: number;
  totalPlayer: number;
}


export declare interface CreateCompany {
  fullname: string;
  email: string;
  noHp: string;
  username: string;
  passwd: string;
  name: string;
  description: string;
  balance: number;
}

export declare interface UpdateCompany {
  name: string;
  description: string;
  balance: number;
}

export declare interface PageCompany extends Paging{
  name: string;
  description: string;
  createName: string;
}