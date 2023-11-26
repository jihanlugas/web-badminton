export interface Player {
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

export interface PlayerCreate {
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  isActive: boolean;
}

export interface PlayerUpdate {
  companyId: string;
  name: string;
  email: string;
  noHp: string;
  address: string;
  gender: string;
  isActive: boolean;
}