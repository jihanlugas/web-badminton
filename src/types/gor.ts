export interface Gor {
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