export interface Company {
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
}

export interface CompanyCreate {
  fullname: string;
  email: string;
  noHp: string;
  username: string;
  passwd: string;
  name: string;
  description: string;
  balance: number;
}

export interface CompanyUpdate {
  name: string;
  description: string;
  balance: number;
}
