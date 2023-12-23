import { Paging } from "@/types/pagination";


export declare interface CreateTransaction {
  companyId: string;
  name: string;
  isDebit: boolean;
  price: number;
}

export declare interface PageTransaction extends Paging {
  companyId: string;
  gorId: string;
  name: string;
  description: string;
}