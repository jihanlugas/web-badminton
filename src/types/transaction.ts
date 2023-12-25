import { Paging } from "@/types/pagination";

export declare interface TransactionView {
  id: string;
  companyId: string;
  name: string;
  isDebit: boolean;
  price: number;
  createBy: string;
  createDt: string;
  companyName: string;
  createName: string;
}

export declare interface CreateTransaction {
  companyId: string;
  name: string;
  isDebit: boolean;
  price: number;
}

export declare interface PageTransaction extends Paging {
  companyId: string;
  name: string;
}